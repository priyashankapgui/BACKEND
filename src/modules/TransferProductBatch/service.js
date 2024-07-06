import TransferProductBatch from "../TransferProductBatch/TransferProductBatch.js";
import * as ProductBatchSumService from "../productBatchSum/service.js";

//Function to create stock transfer IN
export const createStockTransferProductBatchService = async (
  productBatchEntries
) => {
  try {
    if (!Array.isArray(productBatchEntries)) {
      throw new Error("productBatchEntries should be an array");
    }
    const newProductBatchEntries = [];
    for (const entry of productBatchEntries) {
      try {
        const result = await TransferProductBatch.create(entry);
        newProductBatchEntries.push(result);
        console.log("Successfully created entry:", result);

        await ProductBatchSumService.updateProductBatchSumQty(
          entry.productId,
          entry.batchNo,
          entry.supplyingBranch,
          entry.transferQty
        );
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          console.error("Validation error for entry:", entry, error.errors);
          throw error;
        } else {
          console.error("Error creating entry:", entry, error);
          throw error;
        }
      }
    }
    return { success: true, newProductBatchEntries };
  } catch (error) {
    console.error(
      "Error creating Stock Transfer Product Batch:",
      error.message
    );
    throw new Error(
      "Error creating Stock Transfer Product Batch: " + error.message
    );
  }
};
