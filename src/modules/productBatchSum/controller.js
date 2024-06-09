import * as ProductBatchSumService from "../productBatchSum/service.js";
import * as Service from '../productBatchUpdateReason/service.js'
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../productBatchSum/constants.js";

const { SUC_CODES } = Codes;



//Function to get all 
export const getAllProductBatchSumController = async (req, res) => {
  try {
    const allData = await ProductBatchSumService.getAllProductBatchSumData();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error retrieving all product batch sum data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// Controller function to retrieve batch details by productName and branchNo for check price 
export const getBatchDetailsByProductNameController = async (req, res) => {
  try{
    const { productId, branchName } = req.query;
    console.log("product", productId);
    console.log("branch", branchName);

    if (!productId || !branchName) {
      throw new Error("Please provide both productId and branchName");
    }

    const result = await ProductBatchSumService.getBatchDetailsByProductName(productId, branchName);

  SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};




// Controller function to get ProductBatchSum by productId
export const getProductSumBatchByProductIdController = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Missing productId in request parameters" });
  }

  try {
    const productBatchSumData = await ProductBatchSumService.getProductSumBatchByProductId(productId);
    res.status(200).json(productBatchSumData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the ProductBatchSum by productId" });
  }
};





// Controller function to get ProductBatchSum by barcode
export const getProductSumBatchByBarcodeController = async (req, res) => {
  const { barcode } = req.params;

  if (!barcode) {
    return res.status(400).json({ error: "Missing barcode in request parameters" });
  }

  try {
    const productBatchSumData = await ProductBatchSumService.getProductSumBatchByBarcode(barcode);
    res.status(200).json(productBatchSumData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the ProductBatchSum by barcode" });
  }
};


// Controller function to get ProductBatchSum by branchId
export const getBatchSumByBranchIdController = async (req, res) => {
  const { branchId } = req.params;

  if (!branchId) {
    return res.status(400).json({ error: "Missing branchId in request parameters" });
  }

  try {
    const productBatchSumData = await ProductBatchSumService.getBatchSumByBranchId(branchId);
    res.status(200).json(productBatchSumData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the ProductBatchSum by branchId" });
  }
};



// get details of updated STock and price
export const getProductBatchDetailsController = async (req, res) => {
  const { productId, branchName } = req.query;

  try {
    const result = await Service.getProductBatchDetails(productId, branchName);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};



// export const updateProductBatchSumController = async (req, res) => {
//   console.log("searching for data1");
//   const { productId, batchNo, branchId } = req.body;

//   if (!productId || !batchNo) {
//     return res.status(400).json({ error: "Missing productId or batchNo in request body" });
//   }

//   try {
//     await ProductBatchSumService.updateProductBatchSum(productId, batchNo, branchId);
//     res.status(200).json({ message: `ProductBatchSum updated for productId ${productId}, batchNo ${batchNo}` });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while updating the ProductBatchSum" });
//   }
// };



// //Function for adjust the stock quantity
// export const adjustProductQuantity = async (req, res) => {
//   try {
//     const { productName, branchName, batchNo, newQuantity } = req.body;

    
//     await ProductBatchSumService.adjustProductGRNQuantity(productName, branchName, batchNo, newQuantity);

//     const result = await products.findOne({ where: { productName } });

//     SUCCESS(res, SUC_CODES, result, req.span);
//     } catch (err) {
//       console.log(err);
//       ERROR(res, err, res.span);
//     }
// };