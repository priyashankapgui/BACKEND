import { Op, fn, col } from 'sequelize';
import sequelize from '../../../config/database.js';
import productGRN from "../../modules/product_GRN/product_GRN.js";
import grn from "../../modules/GRN/grn.js";
import productBatchSum from '../productBatchSum/productBatchSum.js';
import products from '../product/product.js';
import branches from '../branch/branch.js';
import { mapBranchNameToId } from '../branch/service.js';
import categories from '../category/category.js';

export const updateProductBatchSum = async (productId, batchNo, branchId) => {
  try {
    console.log("searching for data");

    // Find all GRN numbers under the given branchId
    const grnNumbers = await grn.findAll({
      attributes: ['GRN_NO'],
      where: { branchId: branchId }
    });
    console.log("Found GRN numbers:", grnNumbers);
    
    if (!grnNumbers || grnNumbers.length === 0) {
      console.log(`No GRN found for branchId ${branchId}`);
      return;
    }

    // Extract an array of GRN_NOs from the result
    const grnNos = grnNumbers.map(grn => grn.GRN_NO);
    console.log("Extracted GRN numbers:", grnNos);
    console.log("searching for data 2");

    // Find the sum of availableQty for the productId and batchNo under the found GRN_NOs
    const result = await productGRN.findOne({
      attributes: [
        'productId',
        'batchNo',
        'expDate',
        'sellingPrice',
        [fn('SUM', col('availableQty')), 'totalAvailableQty']
      ],
      where: {
        productId: productId,
        batchNo: batchNo,
        GRN_NO: { [Op.in]: grnNos }, // Filter by GRN_NOs under the branchId
        expDate: { [Op.gte]: new Date() }, // Filter out expired batches
        sellingPrice: { [Op.not]: null }
      },
      group: ['productId', 'batchNo', 'expDate', 'sellingPrice']
    });
    console.log("searching for data 3");

    if (result) {
      const { totalAvailableQty, expDate, sellingPrice } = result.dataValues;

      // Upsert the total available quantity into ProductBatchSum
      await productBatchSum.upsert({
        productId: productId,
        batchNo: batchNo,
        branchId: branchId,
        expDate: expDate,
        sellingPrice: sellingPrice,
        totalAvailableQty: totalAvailableQty
      });

      console.log(`Updated ProductBatchSum for productId ${productId}, batchNo ${batchNo}, branchId ${branchId} to ${totalAvailableQty}`);
    } else {
      // If no matching records, remove any existing entry in ProductBatchSum
      await productBatchSum.destroy({
        where: {
          productId: productId,
          batchNo: batchNo,
          branchId: branchId,
        }
      });

      console.log(`Removed ProductBatchSum entry for productId ${productId}, batchNo ${batchNo}, branchId ${branchId}`);
    }
  } catch (error) {
    console.error("Error updating ProductBatchSum:", error);
    throw error;
  }
}; 


export const updateProductQty = async (productIds) => {
  try {
    
    // Fetch the total available quantity for each productId, excluding expired products
    const productsToUpdate = await productBatchSum.findAll({
      
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']],
      where: {
        productId: productIds,
        
      },
      group: ['productId']
    });

    // Iterate through each product and update its qty in the products table
    for (const product of productsToUpdate) {
      const { productId, totalAvailableQty } = product.dataValues;

      await products.update(
        { qty: totalAvailableQty },
        { where: { productId } }
      );

      console.log(`Updated qty for productId ${productId} to ${totalAvailableQty}`);
    }
  } catch (error) {
    console.error("Error updating product quantity:", error);
    throw error;
  }
};





// Service function to retrieve batch details by productName and branchNo for check price
export const getBatchDetailsByProductName = async (productId, branchName) => {
  try {

    const branchId = await mapBranchNameToId(branchName);
    if (!branchId) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // Fetch branch details to get the branchName
    const branch = await branches.findOne({
      where: { branchId },
    });

     

    if (!branch) {
      throw new Error("Branch not found");
    }

    const productBatchSumData = await productBatchSum.findAll({
      where: { productId , branchId },
    });
    console.log("Data",productBatchSumData);

    

    // Extract batch details from the product GRNs
    const batchDetails = productBatchSumData.map((productBatchSumData) => ({
      branchName: branch.branchName,
      batchNo: productBatchSumData.batchNo,
      expDate: productBatchSumData.expDate,
      availableQty: productBatchSumData.totalAvailableQty,
      sellingPrice: productBatchSumData.sellingPrice,
    }));

    return (batchDetails);
  } catch (error) {
    throw new Error("Error retrieving batch details: " + error.message);
  }
}; 




// Service function to get product total quantity and details
export const getProductTotalQuantity = async (branchName, productId) => {
  try {
    // Map branchName to branchId
    const branch = await branches.findOne({ where: { branchName }, attributes: ['branchId', 'branchName'] });
    if (!branch) {
      throw new Error("Branch not found");
    }
    const branchId = branch.branchId;
    

    // Retrieve product details including total quantity
    const productDetails = await products.findOne({
      where: { productId },
    });

    if (!productDetails) {
      throw new Error("Product not found");
    }

    const category = await categories.findOne({ where: { categoryId: productDetails.categoryId }, attributes: ['categoryName'] });
    if (!category) {
      throw new Error("category not found");
    }
    

    // Sum total available quantity from productBatchSum
    const totalAvailableQty = await productBatchSum.sum('totalAvailableQty', {
      where: { productId, branchId }
    });
    
    return {
      productId: productDetails.productId,
      productName: productDetails.productName,
      branchName: branchName,
      categoryName: category.categoryName,
      qty: totalAvailableQty,
    };
  } catch (error) {
    throw new Error("Error retrieving product total quantity: " + error.message);
  }
};
