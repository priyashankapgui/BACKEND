import { updateProductBatchSum, getBatchDetailsByProductName } from "../productBatchSum/service.js";

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
  
    const {  productId, branchName } = req.query;
    console.log("product",productId);
    console.log("branch",branchName);

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
