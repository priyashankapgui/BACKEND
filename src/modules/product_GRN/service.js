import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import { to, TE } from "../../helper.js";
import productGRN from "../product_GRN/product_GRN.js";
import grn from "../GRN/grn.js";
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branches from "../branch/branch.js";
import suppliers from "../supplier/supplier.js";




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
      attributes: ['GRN_NO'], 
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







































