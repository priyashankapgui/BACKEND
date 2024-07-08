import ProductBatchSum from "../productBatchSum/productBatchSum.js";
import ProductBatchUpdateReason from "../productBatchUpdateReason/productBatchUpdateReason.js";
import branches from "../branch/branch.js";
import { Op } from "sequelize";
import { to, TE } from "../../helper.js";

//function to adjust stock details
export const adjustStockDetailsService = async ({
  branchName,
  productId,
  batchNo,
  newQty,
  newSellingPrice,
  reason,
  updatedBy,
}) => {
  let [branchErr, branch] = await to(
    branches.findOne({ where: { branchName } })
  );
  if (branchErr) TE(branchErr);
  if (!branch) TE("Branch not found");
  const branchId = branch.branchId;
  let [productBatchSumErr, productBatchSum] = await to(
    ProductBatchSum.findOne({
      where: {
        productId,
        batchNo,
        branchId,
      },
    })
  );
  if (productBatchSumErr) TE(productBatchSumErr);
  if (!productBatchSum) TE("Product batch not found");

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
  let updateType = "";
  if (newQty !== undefined && newSellingPrice !== undefined) {
    updateType = "both";
  } else if (newQty !== undefined) {
    updateType = "quantity";
  } else if (newSellingPrice !== undefined) {
    updateType = "price";
  }
  if (updateType) {
    let [logErr] = await to(
      ProductBatchUpdateReason.create({
        productId,
        batchNo,
        branchId,
        reason,
        updatedBy,
        updatedAt: new Date(),
        updateType,
      })
    );
    if (logErr) TE(logErr);
  }

  let [saveErr] = await to(productBatchSum.save());
  if (saveErr) TE(saveErr);

  return {
    message: "Stock details updated successfully",
    previousValues,
    updates,
  };
};

//Function to get updatesd  stock and price details
export const getProductBatchDetails = async (productId, branchName) => {
  let [branchErr, branch] = await to(
    branches.findOne({ where: { branchName } })
  );
  if (branchErr) TE(branchErr);
  if (!branch) TE("Branch not found");

  const currentDate = new Date();

  const branchId = branch.branchId;
  let [productBatchSumErr, productBatchSumRecords] = await to(
    ProductBatchSum.findAll({
      where: {
        productId,
        branchId,
        expDate: {
          [Op.gt]: currentDate,
        }
      },
      attributes: ["batchNo", "expDate", "sellingPrice", "totalAvailableQty"],
      raw: true,
    })
  );
  if (productBatchSumErr) TE(productBatchSumErr);
  if (!productBatchSumRecords.length)
    TE("No records found for the given product and branch");

  const results = await Promise.all(
    productBatchSumRecords.map(async (record) => {
      let [updateReasonErr, updateReasonRecord] = await to(
        ProductBatchUpdateReason.findOne({
          where: {
            productId,
            branchId,
            batchNo: record.batchNo,
          },
          attributes: ["reason", "updatedBy", "updatedAt"],
          order: [["updatedAt", "DESC"]],
          raw: true,
        })
      );
      if (updateReasonErr) TE(updateReasonErr);

      return {
        ...record,
        reason: updateReasonRecord ? updateReasonRecord.reason : "N/A",
        updatedBy: updateReasonRecord ? updateReasonRecord.updatedBy : "N/A",
        updatedAt: updateReasonRecord ? updateReasonRecord.updatedAt : "N/A",
      };
    })
  );

  return results;
};
