//import { updateProductBatchSum, getBatchDetailsByProductName, getAllProductBatchSumData, getProductSumBatchByProductId, getProductSumBatchByBarcode, getBatchSumByBranchId, adjustProductGRNQuantity } from "../productBatchSum/service.js";
import * as ProductBatchSumService from "../productBatchSum/service.js";
import * as Service from '../productBatchUpdateReason/service.js'
import branches from "../branch/branch.js";
import products from "../product/product.js";
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
  try {
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




//Function for adjust the stock quantity
export const adjustProductQuantity = async (req, res) => {
  try {
    const { productName, branchName, batchNo, newQuantity } = req.body;

    await ProductBatchSumService.adjustProductGRNQuantity(productName, branchName, batchNo, newQuantity);

    const result = await products.findOne({ where: { productName } });

    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};


export const handleBilling = async (req, res) => {
  try {
    const { billedProducts, branchId } = req.body;

    await ProductBatchSumService.handleBilling(billedProducts, branchId);

    res.status(200).json({ message: 'Billing processed successfully.' });
  } catch (error) {
    console.error("Error processing billing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleBillCancellation = async (req, res) => {
  try {
    const { canceledProducts, branchId } = req.body;

    await ProductBatchSumService.handleBillCancellation(canceledProducts, branchId);

    res.status(200).json({ message: 'Bill cancellation processed successfully.' });
  } catch (error) {
    console.error("Error processing bill cancellation:", error);
    res.status(500).json({ error: "Internal server error" });
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


export const getAllProductsByBranchController = async (req, res) => {
  const { searchTerm, branchName } = req.query;

  try {
    const branch = await branches.findOne({ where: { branchName } });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const products = await ProductBatchSumService.getAllProductsByBranch(searchTerm, branch.branchId);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products data by branch:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductsByBarcodeController = async (req, res) => {
  const { barcode, branchName } = req.query;

  try {
      const branch = await branches.findOne({ where: { branchName } });
      if (!branch) {
          return res.status(404).json({ message: 'Branch not found' });
      }

      const products = await ProductBatchSumService.getProductsByBarcode(barcode, branch.branchId);
      return res.status(200).json(products);
  } catch (error) {
      console.error('Error retrieving products data by barcode:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};
