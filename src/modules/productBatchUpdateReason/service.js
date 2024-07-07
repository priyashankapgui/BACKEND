import ProductBatchSum from '../productBatchSum/productBatchSum.js';
import ProductBatchUpdateReason from '../productBatchUpdateReason/productBatchUpdateReason.js';
import branches from '../branch/branch.js';
import { to, TE } from "../../helper.js";



export const adjustStockDetailsService = async ({ branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy }) => {
 
  let [branchErr, branch] = await to(branches.findOne({ where: { branchName } }));
  if (branchErr) TE(branchErr);
  if (!branch) TE('Branch not found');

  const branchId = branch.branchId;

  let [productBatchSumErr, productBatchSum] = await to(ProductBatchSum.findOne({
    where: {
      productId,
      batchNo,
      branchId,
    },
  }));

  if (productBatchSumErr) TE(productBatchSumErr);
  if (!productBatchSum) TE('Product batch not found');

  const updates = {};
  const previousValues = {};

  // Update the total available quantity if provided
  if (newQty !== undefined) {
    previousValues.previousQty = productBatchSum.totalAvailableQty;
    productBatchSum.totalAvailableQty = newQty;
    updates.newQty = newQty;
  }

  // Update the selling price if provided
  if (newSellingPrice !== undefined) {
    previousValues.previousSellingPrice = productBatchSum.sellingPrice;
    productBatchSum.sellingPrice = newSellingPrice;
    updates.newSellingPrice = newSellingPrice;
  }

  // Determine the update type
  let updateType = '';
  if (newQty !== undefined && newSellingPrice !== undefined) {
    updateType = 'both';
  } else if (newQty !== undefined) {
    updateType = 'quantity';
  } else if (newSellingPrice !== undefined) {
    updateType = 'price';
  }

  if (updateType) {
    let [logErr] = await to(ProductBatchUpdateReason.create({
      productId,
      batchNo,
      branchId,
      reason,
      updatedBy,
      updatedAt: new Date(),
      updateType,
    }));
    if (logErr) TE(logErr);
  }

  // Save the updated productBatchSum
  let [saveErr] = await to(productBatchSum.save());
  if (saveErr) TE(saveErr);

  return { 
    message: 'Stock details updated successfully', 
    previousValues,
    updates 
  };
};





//Function to get updatesd  stock and price details
export const getProductBatchDetails = async (productId, branchName) => {

  let [branchErr, branch] = await to(branches.findOne({ where: { branchName } }));
  if (branchErr) TE(branchErr);
  if (!branch) TE('Branch not found');

  const branchId = branch.branchId;

  let [productBatchSumErr, productBatchSumRecords] = await to(ProductBatchSum.findAll({
    where: {
      productId,
      branchId,
    },
    attributes: ['batchNo', 'expDate', 'sellingPrice', 'totalAvailableQty'],
    raw: true,
  }));
  if (productBatchSumErr) TE(productBatchSumErr);
  if (!productBatchSumRecords.length) TE('No records found for the given product and branch');

  // Get the update reason for each batch
  const results = await Promise.all(productBatchSumRecords.map(async (record) => {
    let [updateReasonErr, updateReasonRecord] = await to(ProductBatchUpdateReason.findOne({
      where: {
        productId,
        branchId,
        batchNo: record.batchNo,
      },
      attributes: ['reason', 'updatedBy', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      raw: true,
    }));
    if (updateReasonErr) TE(updateReasonErr);

    return {
      ...record,
      reason: updateReasonRecord ? updateReasonRecord.reason : 'N/A',
      updatedBy: updateReasonRecord ? updateReasonRecord.updatedBy : 'N/A',
      updatedAt: updateReasonRecord ? updateReasonRecord.updatedAt : 'N/A',
    };
  }));

  return results;
}; 






// export const adjustStockDetails = async (updateRequests) => {
//   try {
//     const results = await Promise.all(updateRequests.map(async (update) => {
//       const { branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy } = update;

//       let [branchErr, branch] = await to(branches.findOne({ where: { branchName } }));
//       if (branchErr) TE(branchErr);
//       if (!branch) TE(`Branch '${branchName}' not found`);

//       const branchId = branch.branchId;

//       let [productBatchSumErr, productBatchSum] = await to(ProductBatchSum.findOne({
//         where: {
//           productId,
//           batchNo,
//           branchId,
//         },
//       }));

//       if (productBatchSumErr) TE(productBatchSumErr);
//       if (!productBatchSum) TE(`Product batch '${batchNo}' not found for product '${productId}'`);

//       const updates = {};
//       const previousValues = {};

//       // Update the total available quantity if provided
//       if (newQty !== undefined) {
//         previousValues.previousQty = productBatchSum.totalAvailableQty;
//         productBatchSum.totalAvailableQty = newQty;
//         updates.newQty = newQty;
//       }

//       // Update the selling price if provided
//       if (newSellingPrice !== undefined) {
//         previousValues.previousSellingPrice = productBatchSum.sellingPrice;
//         productBatchSum.sellingPrice = newSellingPrice;
//         updates.newSellingPrice = newSellingPrice;
//       }

//       // Determine the update type
//       let updateType = '';
//       if (newQty !== undefined && newSellingPrice !== undefined) {
//         updateType = 'both';
//       } else if (newQty !== undefined) {
//         updateType = 'quantity';
//       } else if (newSellingPrice !== undefined) {
//         updateType = 'price';
//       }

//       if (updateType) {
//         let [logErr] = await to(ProductBatchUpdateReason.create({
//           productId,
//           batchNo,
//           branchId,
//           reason,
//           updatedBy,
//           updatedAt: new Date(),
//           updateType,
//         }));
//         if (logErr) TE(logErr);
//       }

//       // Save the updated productBatchSum
//       let [saveErr] = await to(productBatchSum.save());
//       if (saveErr) TE(saveErr);

//       return { 
//         productId,
//         batchNo,
//         message: 'Stock details updated successfully', 
//         previousValues,
//         updates 
//       };
//     }));

//     return results;
//   } catch (err) {
//     throw err;
//   }
// };


