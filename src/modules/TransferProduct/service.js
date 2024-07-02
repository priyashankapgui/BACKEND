import TransferProduct from "../TransferProduct/TransferProduct.js";
import stockTransfer from "../stockTransfer/stockTransfer.js";
import { to, TE } from "../../helper.js";



//Function to create Stock transfer OUT
export const createStockTransferProductService = async (stockTransferProducts) => {
  try {
    if (!Array.isArray(stockTransferProducts)) {
      throw new Error("stockTransferProducts should be an array");
    }

    const newStockTransferProducts = [];

    for (const entry of stockTransferProducts) {
      const [err, result] = await to(TransferProduct.create(entry));

      if (err) {
        if (err.name === 'SequelizeValidationError') {
          console.error("Validation error for entry:", entry, err.errors);
        } else {
          console.error("Error creating entry:", entry, err);
        }
        TE(err);
      }

      newStockTransferProducts.push(result);
      console.log("Successfully created entry:", result);
    }

    return { success: true, newStockTransferProducts };
  } catch (error) {
    console.error("Error creating Stock Transfer Product:", error.message);
    throw new Error("Error creating Stock Transfer Product: " + error.message);
  }
};




 