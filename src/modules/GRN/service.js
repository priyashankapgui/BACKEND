import products from "../product/product.js";
import grn from "../GRN/grn.js";
import suppliers from "../supplier/supplier.js";

// Function to add a new GRN (Goods Receipt Note)
export const addGRN = async (stockData) => {
  try {
    const amount =(stockData.totalQty - stockData.freeQty) * stockData.purchasePrice;
    const stockDataWithAmount = { ...stockData, amount };
    const newStock = await grn.create(stockDataWithAmount);
    return newStock;
  } catch (error) {
    console.error("Error creating stock:", error);
    throw new Error("Error creating stock: " + error.message);
  }
};
// Function to get all GRNs
export const getAllGRNs = async () => {
  try {
    const stocksAll = await grn.findAll();
    return stocksAll;
  } catch (error) {
    throw new Error("Error fetching stocks: " + error.message);
  }
};

// Function to get a GRN by its ID
export const getGRNById = async (GRN_NO) => {
  try {
    const stock = await grn.findByPk(GRN_NO);
    return stock;
  } catch (error) {
    throw new Error("Error fetching stock: " + error.message);
  }
};
// Function to get GRNs by invoice number
export const getGRNByInvoiceNo = async (invoiceNo) => {
  try {
    const stockReq = await grn.findAll({ where: { invoiceNo } });
    return stockReq;
  } catch (error) {
    console.error("Error retrieving stocks:", error);
    throw new Error("Error retrieving stocks");
  }
};
// Function to get GRN details based on provided criteria
export const getGRNDetails = async ({
  invoiceNo,
  productId,
  productName,
  supplierId,
  supplierName,
}) => {
  try {
    let whereClause = {};

    for (const key in {
      invoiceNo,
      productId,
      productName,
      supplierId,
      supplierName,
    }) {
      switch (key) {
        case "invoiceNo":
        case "productId":
        case "productName":
        case "supplierId":
        case "supplierName":
          if (eval(key)) {
            whereClause[key] = eval(key);
          }
          break;
      }
    }

    const stockDetails = await grn.findAll({ where: whereClause });
    return stockDetails;
  } catch (error) {
    console.error("Error retrieving stock details:", error);
    throw new Error("Error retrieving stock details");
  }
};

// Function to update a GRN by its ID
export const updateGRNById = async (GRN_NO, updatedStockData) => {
  try {
    const stock = await grn.findByPk(GRN_NO);
    if (!stock) {
      throw new Error("Stock not found");
    }
    await stock.update(updatedStockData, {
      where: { GRN_NO: GRN_NO } 
    });
    return stock;
  } catch (error) {
    throw new Error("Error updating stock: " + error.message);
  }
};

// Function to delete a GRN by its ID
export const deleteGRNById = async (GRN_NO) => {
  try {
    const stock = await grn.findByPk(GRN_NO);
    if (!stock) {
      throw new Error("Stock not found");
    }
    await stock.destroy();
  } catch (error) {
    throw new Error("Error deleting stock: " + error.message);
  }
};
