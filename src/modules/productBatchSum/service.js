import { Op, fn, col } from 'sequelize';
import Sequelize from 'sequelize';
import sequelize from '../../../config/database.js';
import { to, TE } from "../../helper.js";
import productGRN from "../../modules/product_GRN/product_GRN.js";
import grn from "../../modules/GRN/grn.js";
import productBatchSum from '../productBatchSum/productBatchSum.js';
import products from '../product/product.js';
import branches from '../branch/branch.js';
import { mapBranchNameToId } from '../branch/service.js';
import categories from '../category/category.js';


// Add data to the productBatchSum table using hooks in productGRN table
export const updateProductBatchSum = async (productId, batchNo, branchId) => {
  try {
    const grnNumbers = await grn.findAll({
      attributes: ['GRN_NO'],
      where: { branchId: branchId }
    });

    if (!grnNumbers || grnNumbers.length === 0) {
      return;
    }

    const grnNos = grnNumbers.map(grn => grn.GRN_NO);

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
        GRN_NO: { [Op.in]: grnNos },
        expDate: { [Op.gte]: new Date() },
        sellingPrice: { [Op.not]: null }
      },
      group: ['productId', 'batchNo', 'expDate', 'sellingPrice']
    });

    if (result) {
      const { totalAvailableQty, expDate, sellingPrice } = result.dataValues;

      const product = await products.findOne({
        where: { productId: productId },
        attributes: ['productName', 'barcode']
      });

      if (!product) {
        throw new Error(`Product with productId ${productId} not found`);
      }

      const productName = product.productName;
      const barcode = product.barcode;

      const branch = await branches.findOne({
        where: { branchId: branchId },
        attributes: ['branchName']
      });

      if (!branch) {
        throw new Error(`Branch with branchId ${branchId} not found`);
      }

      const branchName = branch.branchName;

      await productBatchSum.upsert({
        productId: productId,
        batchNo: batchNo,
        barcode: barcode,
        branchId: branchId,
        expDate: expDate,
        sellingPrice: sellingPrice,
        totalAvailableQty: totalAvailableQty,
        productName: productName,
        branchName: branchName
      });

      console.log(`Updated ProductBatchSum for productId ${productId}, batchNo ${batchNo}, branchId ${branchId} to ${totalAvailableQty}`);
    } else {
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

// Function to get active stock (controller file is in the product controller)
export const getProductTotalQuantity = async (branchName, productId) => {

  const [branchErr, branch] = await to(
    branches.findOne({ where: { branchName }, attributes: ['branchId', 'branchName'] })
  );
  if (branchErr) TE(branchErr);
  if (!branch) TE("Branch not found");

  const branchId = branch.branchId;

  const [productErr, productDetails] = await to(
    products.findOne({ where: { productId } })
  );
  if (productErr) TE(productErr);
  if (!productDetails) TE("Product not found");

  const [categoryErr, category] = await to(
    categories.findOne({ where: { categoryId: productDetails.categoryId }, attributes: ['categoryName'] })
  );
  if (categoryErr) TE(categoryErr);
  if (!category) TE("Category not found");

  const [qtyErr, totalAvailableQty] = await to(
    productBatchSum.sum('totalAvailableQty', { where: { productId, branchId } })
  );
  if (qtyErr) TE(qtyErr);

  return {
    productId: productDetails.productId,
    productName: productDetails.productName,
    branchName: branch.branchName,
    categoryName: category.categoryName,
    qty: totalAvailableQty,
  };
};

// function to retrieve batch details by productName and branchNo for check price 
export const getBatchDetailsByProductName = async (productId, branchName) => {
  try {
    const [branchIdErr, branchId] = await to(mapBranchNameToId(branchName));
    if (branchIdErr) TE(branchIdErr);
    if (!branchId) TE(new Error("Branch not found"));

    const [branchErr, branch] = await to(branches.findOne({ where: { branchId } }));
    if (branchErr) TE(branchErr);
    if (!branch) TE(new Error("Branch not found"));

    const [productBatchSumDataErr, productBatchSumData] = await to(
      productBatchSum.findAll({ where: { productId, branchId } })
    );
    if (productBatchSumDataErr) TE(productBatchSumDataErr);

    const batchDetails = productBatchSumData.map((productBatchSumData) => ({
      branchName: branch.branchName,
      batchNo: productBatchSumData.batchNo,
      expDate: productBatchSumData.expDate,
      availableQty: productBatchSumData.totalAvailableQty,
      sellingPrice: productBatchSumData.sellingPrice,
      discount: productBatchSumData.discount,
    }));

    return batchDetails;
  } catch (error) {
    console.error("Error retrieving batch details:", error);
    throw new Error("Error retrieving batch details: " + error.message);
  }
};

// Function to adjust the stock quantity
export const adjustProductGRNQuantity = async (productName, branchName, batchNo, newQuantity) => {
  try {
    const [branchErr, branch] = await to(branches.findOne({ where: { branchName: branchName } }));
    if (branchErr) TE(branchErr);
    if (!branch) TE(new Error('Branch not found.'));
    const branchId = branch.branchId;
    console.log(`Found branchId: ${branchId} for branchName: ${branchName}`);

    const [productErr, product] = await to(products.findOne({ where: { productName: productName } }));
    if (productErr) TE(productErr);
    if (!product) TE(new Error('Product not found.'));
    const productId = product.productId;
    console.log(`Found productId: ${productId} for productName: ${productName}`);

    // Update the totalAvailableQty with the newQuantity
    const [updateErr] = await to(
      productBatchSum.update(
        { totalAvailableQty: newQuantity },
        {
          where: {
            productId: productId,
            branchId: branchId,
            batchNo: batchNo
          }
        }
      )
    );
    if (updateErr) TE(updateErr);

    return true;
  } catch (error) {
    console.error("Error adjusting Product Batch Sum quantity:", error);
    throw error;
  }
};


// Function to update totalAvailableQty when stock transfer IN
export const updateProductBatchSumQty = async (productId, batchNo, supplyingBranch, transferQty) => {
  const [branchErr, branch] = await to(branches.findOne({ where: { branchName: supplyingBranch } }));
    if (branchErr) TE(branchErr);
    if (!branch) TE(new Error('Branch not found.'));
    const branchId = branch.branchId;

  try {
    const productBatchSumEntry = await productBatchSum.findOne({
      where: {
        productId,
        batchNo,
        branchId,
      },
    });

    if (productBatchSumEntry) {
      productBatchSumEntry.totalAvailableQty -= transferQty;
      await productBatchSumEntry.save();
    } else {
      throw new Error(`Product batch sum entry not found for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}`);
    }
  } catch (error) {
    console.error('Error updating product batch sum:', error);
    throw error;
  }
};




// Function to update or create productBatchSum entry when saving stock transfer OUT
export const updateOrAddProductBatchSum = async ( requestBranch, productDetails) => {
  const updatedProductBatchSums = [];

  try {
    for (const product of productDetails) {
      const { productId, batchNo, transferQty } = product;

      const [branchErr, branch] = await to(branches.findOne({ where: { branchName: requestBranch } }));
      if (branchErr) TE(branchErr);
      if (!branch) TE(new Error('Requesting branch not found.'));
      const branchId = branch.branchId;

      let productBatchSumEntry = await productBatchSum.findOne({
        where: {
          productId,
          batchNo,
          branchId,
        },
      });

      // Update existing productBatchSum entry or create new one
      if (productBatchSumEntry) {
        productBatchSumEntry.totalAvailableQty += transferQty;
        await productBatchSumEntry.save();
      } else {

        const product = await products.findOne({
          where: { productId: productId },
          attributes: ['productName']
        });
  
        if (!product) {
          throw new Error(`Product with productId ${productId} not found`);
        }

        const productName = product.productName;

        productBatchSumEntry = await productBatchSum.create({
          productId,
          batchNo,
          branchId,
          productName,
          branchName: requestBranch,
          totalAvailableQty: transferQty,
        });
      }

      updatedProductBatchSums.push(productBatchSumEntry);
    }

    return updatedProductBatchSums;
  } catch (error) {
    console.error('Error updating or adding product batch sum:', error);
    throw error;
  }
};



//function to get batchNo
export const getBatchNumbersByBranchAndProduct = async (branchName, productId) => {
  try {

    const branch = await branches.findOne({
      where: { branchName: branchName },
      attributes: ['branchId']
    });

    if (!branch) {
      throw new Error(`BranchId not found`);
    }

    const branchId = branch.branchId;

    const batchNumbers = await productBatchSum.findAll({
      attributes: ['batchNo', 'totalAvailableQty' , 'sellingPrice'],
      where: {
        branchId,
        productId,
      },
    });

    return batchNumbers.map(record => ({
      batchNo: record.batchNo,
      totalAvailableQty: record.totalAvailableQty,
      sellingPrice: record.sellingPrice,
    }));
  } catch (error) {
    console.error('Error fetching batch numbers:', error);
    throw error;
  }
};



export const getAllProductBatchSumData = async () => {
  try {
    const allData = await productBatchSum.findAll();
    return allData;
  } catch (error) {
    throw new Error("Error retrieving all product batch sum data: " + error.message);
  }
};



// Handling billing process
export const handleBilling = async (billedProducts, branchName) => {
  const branchId = await mapBranchNameToId(branchName);
  const updates = billedProducts.map(async (billedProducts) => {
    const { productId, batchNo, billQty } = billedProducts;

    const productBatch = await productBatchSum.findOne({
      where: {
        productId: productId,
        batchNo: batchNo,
        branchId: branchId,
      },
    });

    if (!productBatch) {
      throw new Error(`No product batch found for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}`);
    }

    const newTotalAvailableQty = productBatch.totalAvailableQty - billQty;

    if (newTotalAvailableQty < 0) {
      throw new Error(`Insufficient stock for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}`);
    }

    await productBatchSum.update(
      { totalAvailableQty: newTotalAvailableQty },
      {
        where: {
          productId: productId,
          batchNo: batchNo,
          branchId: branchId,
        },
      }
    );
  });

  await Promise.all(updates);
};

// Handling refunds process
export const handleRefund = async (refundedProducts, branchId) => {
  const updates = refundedProducts.map(async (refundedProduct) => {
    const { productId, batchNo, quantityRefunded } = refundedProduct;

    const productBatch = await productBatchSum.findOne({
      where: {
        productId: productId,
        batchNo: batchNo,
        branchId: branchId,
      },
    });

    if (!productBatch) {
      throw new Error(`No product batch found for productId: ${productId}, batchNo: ${batchNo}, branchId: ${branchId}`);
    }

    const newTotalAvailableQty = productBatch.totalAvailableQty + quantityRefunded;

    await productBatchSum.update(
      { totalAvailableQty: newTotalAvailableQty },
      {
        where: {
          productId: productId,
          batchNo: batchNo,
          branchId: branchId,
        },
      }
    );
  });

  await Promise.all(updates);
};


export const getAllProductsByBranch = async (searchTerm, branchId) => {
  try {
    const products = await productBatchSum.findAll({
      where: {
        branchId: branchId,
        [Op.or]: [
          { productId: { [Op.like]: `%${searchTerm}%` } },
          { productName: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });

    if (!products || products.length === 0) {
      return []; // Return an empty array if no products found
    }

    return products.map(product => {
      if (!product.barcode) {
        console.error('Product does not have a barcode:', product);
      }

      return {
        productId: product.productId,
        productName: product.productName,
        batchNo: product.batchNo,
        barcode: product.barcode,
        totalAvailableQty: product.totalAvailableQty,
        discount: product.discount,
        branchId: product.branchId,
        branchName: product.branchName,
        expDate: product.expDate,
        sellingPrice: product.sellingPrice,
      };
    });
  } catch (error) {
    console.error('Error retrieving products data by branch:', error);
    throw new Error('Error retrieving products data by branch');
  }
};

export const getProductsByBarcode = async (barcode, branchId) => {
  try {
    const products = await productBatchSum.findAll({
      where: {
        branchId: branchId,
        barcode: barcode
      }
    });

    if (!products || products.length === 0) {
      return []; // Return an empty array if no products found
    }

    return products.map(product => {
      return {
        productId: product.productId,
        productName: product.productName,
        batchNo: product.batchNo,
        barcode: product.barcode,
        totalAvailableQty: product.totalAvailableQty,
        discount: product.discount,
        branchId: product.branchId,
        branchName: product.branchName,
        expDate: product.expDate,
        sellingPrice: product.sellingPrice,
      };
    });
  } catch (error) {
    console.error('Error retrieving products data by barcode:', error);
    throw new Error('Error retrieving products data by barcode');
  }
};



//Function to update the discount
export const updateProductBatchDiscount = async (
  productId,
  batchNo,
  branchName,
  discount
) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    const productBatchSumData = await productBatchSum.findOne({
      where: {
        productId,
        batchNo,
        branchId,
      },
    });

    if (!productBatchSumData) {
      throw new Error('Product batch not found');
    }

    productBatchSumData.discount = discount;
    await productBatchSumData.save();

    return productBatchSumData;
  } catch (error) {
    throw new Error(`Failed to update discount: ${error.message}`);
  }
};



//Function to minQty
export const getProductQuantitiesByBranch = async (branchName) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    const productBatches = await productBatchSum.findAll({
      where: { branchId },
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']],
      group: ['productId'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const productId = productBatch.productId;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities by branch:', error);
    throw new Error('Unable to fetch product quantities');
  }
};





export const getProductQuantitiesByProductAndBranch = async (branchName, productId) => {
  try {
    const branchId = await mapBranchNameToId(branchName);

    const productBatches = await productBatchSum.findAll({
      where: { branchId , productId },
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']],
      group: ['productId', 'branchId'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const productId = productBatch.productId;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities by branch:', error);
    throw new Error('Unable to fetch product quantities');
  }
};




//min qty without any parameter
export const getAllProductQuantities = async () => {
  try {
    const productBatches = await productBatchSum.findAll({
      attributes: [
        'productId', 
        'branchId',
        'branchName',
        [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']
      ],
      group: ['productId', 'branchId', 'branchName'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const productId = productBatch.productId;
      const branchName = productBatch.branchName;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities:', error);
    throw new Error('Unable to fetch product quantities');
  }
};







export const getProductQuantitiesByProductId = async (productId) => {
  try {
    const productBatches = await productBatchSum.findAll({
      where: { productId },
      attributes: [
        'productId', 
        'branchId',
        'branchName',
        [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']
      ],
      group: ['productId', 'branchId', 'branchName'],
    });

    const results = [];

    for (const productBatch of productBatches) {
      const branchName = productBatch.branchName;
      const totalAvailableQty = parseFloat(productBatch.getDataValue('totalAvailableQty'));

      const product = await products.findOne({
        where: { productId },
        attributes: ['minQty', 'productName'],
      });

      if (product && totalAvailableQty < product.minQty) {
        results.push({
          branchName,
          productId,
          productName: product.productName,
          minQty: product.minQty,
          totalAvailableQty,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching product quantities by product ID:', error);
    throw new Error('Unable to fetch product quantities');
  }
};