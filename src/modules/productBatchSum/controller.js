import { updateProductBatchSum } from "../productBatchSum/service.js";

export const updateProductBatchSumController = async (req, res) => {
  const { productId, batchNo } = req.body;

  if (!productId || !batchNo) {
    return res.status(400).json({ error: "Missing productId or batchNo in request body" });
  }

  try {
    await updateProductBatchSum(productId, batchNo);
    res.status(200).json({ message: `ProductBatchSum updated for productId ${productId}, batchNo ${batchNo}` });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the ProductBatchSum" });
  }
};
 