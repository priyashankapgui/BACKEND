import productGRN from "../product_GRN/product_GRN.js";
import grn from "../GRN/grn.js";

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

// Import necessary modules and models


// Service function to calculate total amount by invoice number
export const calculateTotalAmount = async (invoiceNo) => {
  try {
    // Find all GRN entries with the provided invoice number
    const grnEntries = await grn.findAll({ where: { invoiceNo } });

    if (!grnEntries || grnEntries.length === 0) {
      throw new Error("No GRN entries found with the provided invoice number");
    }

    // Initialize total amount
    let totalAmount = 0;

    // Iterate over each GRN entry
    for (const grnEntry of grnEntries) {
      // Find all product GRNs associated with the current GRN entry
      const productGRNs = await productGRN.findAll({ where: { GRN_No: grnEntry.GRN_NO } });

      // Calculate total amount from the product GRNs and add to the overall total
      for (const productGRN of productGRNs) {
        totalAmount += (productGRN.totalQty - productGRN.freeQty) * productGRN.purchasePrice;
      }
    }

    return totalAmount;
  } catch (error) {
    throw new Error("Error calculating total amount: " + error.message);
  }
};
