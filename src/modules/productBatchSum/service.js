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

    const grnNumbers = await grn.findAll({
      attributes: ['GRN_NO'],
      where: { branchId: branchId }
    });
    console.log("Found GRN numbers:", grnNumbers);

    if (!grnNumbers || grnNumbers.length === 0) {
      console.log(`No GRN found for branchId ${branchId}`);
      return;
    }

    const grnNos = grnNumbers.map(grn => grn.GRN_NO);
    console.log("Extracted GRN numbers:", grnNos);
    console.log("searching for data 2");

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
    console.log("searching for data 3");

    if (result) {
      const { totalAvailableQty, expDate, sellingPrice } = result.dataValues;

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
    const productsToUpdate = await productBatchSum.findAll({
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('totalAvailableQty')), 'totalAvailableQty']],
      where: {
        productId: productIds,
      },
      group: ['productId']
    });

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

export const getBatchDetailsByProductName = async (productId, branchName) => {
  try {
    const branchId = await mapBranchNameToId(branchName);
    if (!branchId) {
      return res.status(404).json({ error: "Branch not found" });
    }

    const branch = await branches.findOne({ where: { branchId } });

    if (!branch) {
      throw new Error("Branch not found");
    }

    const productBatchSumData = await productBatchSum.findAll({ where: { productId, branchId } });
    console.log("Data", productBatchSumData);

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

export const getProductTotalQuantity = async (branchName, productId) => {
  try {
    const branch = await branches.findOne({ where: { branchName }, attributes: ['branchId', 'branchName'] });
    if (!branch) {
      throw new Error("Branch not found");
    }
    const branchId = branch.branchId;

    const productDetails = await products.findOne({ where: { productId } });

    if (!productDetails) {
      throw new Error("Product not found");
    }

    const category = await categories.findOne({ where: { categoryId: productDetails.categoryId }, attributes: ['categoryName'] });
    if (!category) {
      throw new Error("category not found");
    }

    const totalAvailableQty = await productBatchSum.sum('totalAvailableQty', { where: { productId, branchId } });

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

export const getAllProductBatchSumData = async () => {
  try {
    const allData = await productBatchSum.findAll();
    return allData;
  } catch (error) {
    throw new Error("Error retrieving all product batch sum data: " + error.message);
  }
};

// Function to get ProductBatchSum by productId
export const getProductSumBatchByProductId = async (productId) => {
  try {
    const productBatchSumData = await productBatchSum.findByPk(productId);
    return productBatchSumData;
  } catch (error) {
    throw new Error("Error retrieving ProductBatchSum by productId: " + error.message);
  }
};

// Function to get ProductBatchSum by barcode
export const getProductSumBatchByBarcode = async (barcode) => {
  try {
    const productBatchSumData = await productBatchSum.findOne({ where: { barcode: barcode } });
    return productBatchSumData;
  } catch (error) {
    throw new Error("Error retrieving ProductBatchSum by barcode: " + error.message);
  }
};

// Function to get ProductBatchSum by branchId
export const getBatchSumByBranchId = async (branchId) => {
  try {
    const productBatchSumData = await productBatchSum.findOne({ where: { branchId: branchId } });
    return productBatchSumData;
  } catch (error) {
    throw new Error("Error retrieving ProductBatchSum by branchId: " + error.message);
  }
};
