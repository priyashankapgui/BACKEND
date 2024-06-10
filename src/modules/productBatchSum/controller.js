import * as ProductBatchSumService from "../productBatchSum/service.js";
import products from "../product/product.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../productBatchSum/constants.js";

const { SUC_CODES } = Codes;

// New controller function to get all products by branch
export const getAllProductsByBranchController = async (req, res) => {
  const { branchName } = req.params;

  if (!branchName) {
    return res.status(400).json({ error: "Missing branchName in request parameters" });
  }

  try {
    const products = await ProductBatchSumService.getAllProductsByBranch(branchName);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products by branch:", error);
    res.status(500).json({ error: "An error occurred while retrieving products by branch" });
  }
};

// New controller function to get product details by branch and product ID
export const getProductDetailsByBranchController = async (req, res) => {
  const { productId, branchName } = req.params;

  if (!productId || !branchName) {
    return res.status(400).json({ error: "Missing productId or branchName in request parameters" });
  }

  try {
    const productDetails = await ProductBatchSumService.getProductDetailsByBranch(productId, branchName);
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error retrieving product details by branch:", error);
    res.status(500).json({ error: "An error occurred while retrieving product details by branch" });
  }
};

// Existing controller functions
export const getAllProductBatchSumController = async (req, res) => {
  try {
    const allData = await ProductBatchSumService.getAllProductBatchSumData();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error retrieving all product batch sum data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBatchDetailsByProductNameController = async (req, res) => {
  try{
    const { productId, branchName } = req.body;
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

export const getBatchSumByBranchIdController = async (req, res) => {
  const { branchId } = req.params;

  if (!branchId) {
    return res.status(400).json({ error: "Missing branchId in request parameters" });
  }

  try {
    const productBatchSumData = await ProductBatchSumService.getBatchSumByBranchId(branchId);
    res.status(200).json(productBatchSumData);
  } catch (error) {
    res.status (500).json({ error: "An error occurred while retrieving the ProductBatchSum by branchId" });
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
