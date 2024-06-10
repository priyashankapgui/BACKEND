import * as Service from '../productBatchUpdateReason/service.js'
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../productBatchSum/constants.js";

const { SUC_CODES } = Codes;

// export const adjustStockDetails = async (req, res) => {
//   const { branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy } = req.query;
//   console.log("data",branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy);

//   if (!branchName || !productId || !batchNo || (!newQty && newQty !== 0) && (!newSellingPrice && newSellingPrice !== 0) || !reason || !updatedBy) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const result = await Service.adjustStockDetailsService({ branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy });
// SUCCESS(res, SUC_CODES, result, req.span);
//     } catch (err) {
//       console.log(err);
//       ERROR(res, err, res.span);
//     }
// };


export const adjustStockDetails = async (req, res) => {
  const updates = req.body.updates;
  console.log("data ha",updates);

  if (!updates || !updates.length) {
    return res.status(400).json({ error: 'At least one update is required' });
  }

  try {
    const results = await Promise.all(updates.map(async (update) => {
      const { branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy } = update;

      if (!branchName || !productId || !batchNo || (!newQty && newQty !== 0) && (!newSellingPrice && newSellingPrice !== 0) || !reason || !updatedBy) {
        return Promise.reject({ error: 'All fields are required' });
      }

      return Service.adjustStockDetailsService({ branchName, productId, batchNo, newQty, newSellingPrice, reason, updatedBy });
    }));

    SUCCESS(res, SUC_CODES, results, req.span); 
  } catch (err) {
    console.error(err);
    ERROR(res, err, res.span);
  }
};
