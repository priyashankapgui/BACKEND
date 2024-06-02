import { updateProductBatchSum, getBatchDetailsByProductName, getAllProductBatchSumData, getProductSumBatchByProductId, getProductSumBatchByBarcode, getBatchSumByBranchId } from "../productBatchSum/service.js";

export const getAllProductBatchSumController = async (req, res) => {
  try {
    const allData = await getAllProductBatchSumData();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error retrieving all product batch sum data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import { updateProductBatchSum,getproductdiscount } from "../productBatchSum/service.js";

export const updateProductBatchSumController = async (req, res) => {
  console.log("searching for data1");
  const { productId, batchNo, branchId } = req.body;

  if (!productId || !batchNo) {
    return res.status(400).json({ error: "Missing productId or batchNo in request body" });
  }

  try {
    await updateProductBatchSum(productId, batchNo, branchId);
    res.status(200).json({ message: `ProductBatchSum updated for productId ${productId}, batchNo ${batchNo}` });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the ProductBatchSum" });
  }
};



// Controller function to retrieve batch details by productName and branchNo for check price 
export const getBatchDetailsByProductNameController = async (req, res) => {
  try {

    const { productId, branchName } = req.body;
    console.log("product", productId);
    console.log("branch", branchName);

    if (!productId || !branchName) {
      throw new Error("Please provide both productId and branchName");
    }

    const batchDetails = await getBatchDetailsByProductName(productId, branchName);


    res.status(200).json(batchDetails);
  } catch (error) {
    console.error("Error retrieving batch details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to get ProductBatchSum by productId
export const getProductSumBatchByProductIdController = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Missing productId in request parameters" });
  }

  try {
    const productBatchSumData = await getProductSumBatchByProductId(productId);
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
    const productBatchSumData = await getProductSumBatchByBarcode(barcode);
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
    const productBatchSumData = await getBatchSumByBranchId(branchId);
    res.status(200).json(productBatchSumData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the ProductBatchSum by branchId" });
  }
};
 //=================================
 export const getdiscount = async (req, res) => {
  try {
    const productsList = await getproductdiscount(); 
    res.status(200).json(productsList);  
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};
//========================================