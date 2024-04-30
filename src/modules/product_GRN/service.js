import productGRN from "../product_GRN/product_GRN.js";

export const createProductGRNService = async ({
  productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment
}) => {
  try {
    const newProductGRN = await productGRN.create({
      productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment
    });
    return newProductGRN;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Error creating product supplier: " + error.message);
    }
  }
}; 



// export const addGRN = async (stockData) => {
//   try {
//     const amount =(stockData.totalQty - stockData.freeQty) * stockData.purchasePrice;
//     const stockDataWithAmount = { ...stockData, amount };
//     const newStock = await grn.create(stockDataWithAmount);
//     return newStock;
//   } catch (error) {
//     console.error("Error creating stock:", error);
//     throw new Error("Error creating stock: " + error.message);
//   }
// };