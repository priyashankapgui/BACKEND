import sequelize from "../../../config/database.js";
import { to, TE } from "../../helper.js";
import productGRN from "../product_GRN/product_GRN.js";
import grn from "../GRN/grn.js";
import branches from "../branch/branch.js";
import suppliers from "../supplier/supplier.js";
import products from "../product/product.js";





 //Function to create GRN 
export const createProductGRNService = async (productGRNs) => {
  try {
    if (!Array.isArray(productGRNs)) {
      throw new Error("productGRNEntries should be an array");
    }

    const newProductGRNs = [];

    for (const entry of productGRNs) {
      try {
        const result = await productGRN.create(entry);
        newProductGRNs.push(result);
        console.log("Successfully created entry:", result);
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          console.error("Validation error for entry:", entry, error.errors);
          throw error; 
        } else {
          console.error("Error creating entry:", entry, error);
          throw error; 
        }
      }
    }

    return { success: true, newProductGRNs };
  } catch (error) {
    console.error("Error creating product GRN:", error.message);
    throw new Error("Error creating product GRN: " + error.message);
  }
};



// Service function to calculate total amount by invoice number
export const calculateTotalAmount = async (invoiceNo) => {
  try {
   
    const [grnErr, grnEntries] = await to(grn.findAll({ where: { invoiceNo } }));

    if (grnErr) TE(grnErr);
    if (!grnEntries || grnEntries.length === 0) {
      TE("No GRN entries found with the provided invoice number");
    }

    let totalAmount = 0;

    for (const grnEntry of grnEntries) {

      const [productGRNErr, productGRNs] = await to(productGRN.findAll({ where: { GRN_NO: grnEntry.GRN_NO } }));

      if (productGRNErr) TE(productGRNErr);

      for (const productGRN of productGRNs) {
        totalAmount += productGRN.amount;
      }
    }

    return totalAmount;
  } catch (error) {
    console.error('Error calculating total amount:', error);
    throw new Error('Error calculating total amount: ' + error.message);
  }
};





// Function to get GRN data by productId
export const getGRNDetailsByProductId = async (productId) => {
  try {
    const [productGRNErr, productGRNs] = await to(productGRN.findAll({
      where: { productId },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('GRN_NO')), 'GRN_NO']], // Using distinct to get unique GRN_NO
      raw: true, 
    }));

    if (productGRNErr) TE(productGRNErr);

    const results = await Promise.all(productGRNs.map(async (productGRNItem) => {
      const { GRN_NO } = productGRNItem;

      const [grnErr, grnItem] = await to(grn.findOne({
        where: { GRN_NO },
        attributes: ['GRN_NO', 'createdAt', 'branchId', 'supplierId', 'invoiceNo'],
        raw: true,
      }));

      if (grnErr) TE(grnErr);
      if (!grnItem) {
        TE(`GRN not found for GRN_NO: ${GRN_NO}`);
      }

      const [supplierErr, supplier] = await to(suppliers.findOne({
        where: { supplierId: grnItem.supplierId },
        attributes: ['supplierName'],
        raw: true,
      }));

      if (supplierErr) TE(supplierErr);
      if (!supplier) {
        TE(`Supplier not found for supplierId: ${grnItem.supplierId}`);
      }

      const [branchErr, branch] = await to(branches.findOne({
        where: { branchId: grnItem.branchId },
        attributes: ['branchName'],
        raw: true,
      }));

      if (branchErr) TE(branchErr);
      if (!branch) {
        TE(`Branch not found for branchId: ${grnItem.branchId}`);
      }

      return {
        GRN_NO: grnItem.GRN_NO,
        createdAt: grnItem.createdAt,
        branchName: branch.branchName,
        supplierName: supplier.supplierName,
        invoiceNo: grnItem.invoiceNo,
      };
    }));

    return results;
  } catch (error) {
    console.error('Error fetching GRN details by productId:', error);
    throw new Error('Error fetching GRN details by productId: ' + error.message);
  }
};




//function to get all grn data using GRN_NO
export const getGRNDetailsByNo = async (GRN_NO) => {
  console.log("Fetching GRN details for:", GRN_NO);
  try {
    const grnItem = await grn.findOne({
      where: { GRN_NO },
      raw: true,
    });
    if (!grnItem) {
      throw new Error("GRN not found");
    }
    console.log("GRN details:", grnItem);

    const supplier = await suppliers.findOne({
      where: { supplierId: grnItem.supplierId },
      raw: true,
    });
    if (!supplier) {
      throw new Error("Supplier not found for GRN_NO: " + GRN_NO);
    }
    console.log("Supplier details:", supplier);

    const branch = await branches.findOne({
      where: { branchId: grnItem.branchId },
      raw: true,
    });
    if (!branch) {
      throw new Error("Branch not found for GRN_NO: " + GRN_NO);
    }
    console.log("Branch details:", branch);

    // Fetch all productGRN details for the given GRN_NO
    const productGRNs = await productGRN.findAll({
      where: { GRN_NO },
      attributes: ['batchNo', 'productId', 'totalQty', 'sellingPrice', 'purchasePrice', 'freeQty', 'expDate', 'amount', 'comment'],
      raw: true,
    });
    console.log("ProductGRN details:", productGRNs);

    // Fetch product details and format the result
    const productGRNsWithDetails = await Promise.all(productGRNs.map(async (productGRN) => {
      const product = await products.findOne({
        where: { productId: productGRN.productId },
        raw: true,
      });
      if (!product) {
        throw new Error("Product not found for productId: " + productGRN.productId);
      }

      return {
        productId: productGRN.productId,
        productName: product.productName,
        batchNo: productGRN.batchNo,
        totalQty: productGRN.totalQty,
        sellingPrice: productGRN.sellingPrice,
        purchasePrice: productGRN.purchasePrice,
        freeQty: productGRN.freeQty,
        expDate: productGRN.expDate,
        amount: productGRN.amount,
        comment: productGRN.comment,
        
      };
    }));

    // Format the final result
    const result = {
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt,
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
      productGRNs: productGRNsWithDetails,
    };

    console.log("Final result:", result);
    return result;
  } catch (error) {
    console.error('Error fetching GRN details:', error);
    throw new Error('Failed to fetch GRN details');
  }
};
