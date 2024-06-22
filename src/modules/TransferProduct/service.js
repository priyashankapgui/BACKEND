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




  //Function to get transfer data using produtId
  export const getStockTransfersByProductId = async (productId) => {

    const [err, transferProducts] = await to(TransferProduct.findAll({
      where: { productId },
      attributes: ['STN_NO'], 
    }));
  
    if (err) TE(err);
    if (!transferProducts || transferProducts.length === 0) TE("No stock transfers found for this product");
  
    const STN_NOs = transferProducts.map(tp => tp.STN_NO);
  
    const [stockTransferErr, stockTransfers] = await to(stockTransfer.findAll({
      where: { STN_NO: STN_NOs },
      attributes: ['STN_NO', 'createdAt', 'requestBranch', 'status', 'requestedBy', 'submittedBy', 'submittedAt'],
    }));
  
    if (stockTransferErr) TE(stockTransferErr);
    if (!stockTransfers || stockTransfers.length === 0) TE("No stock transfer details found for the provided STN_NO(s)");
  
    return stockTransfers;
  };