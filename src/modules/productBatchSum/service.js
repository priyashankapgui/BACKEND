import { Op, fn, col } from 'sequelize';
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
