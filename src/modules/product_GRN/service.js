import productGRN from "../product_GRN/product_GRN.js";
import grn from "../GRN/grn.js";
import branches from "../branch/branch.js";
import suppliers from "../supplier/supplier.js";
import products from "../product/product.js";

export const getAllProductGRN = async () => {
  try {
    const branchReq = await productGRN.findAll();
    return branchReq;
  } catch (error) {
    console.error("Error retrieving branches:", error);
    throw new Error("Error retrieving branches");
  }
};

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
        if (error.name === "SequelizeValidationError") {
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

//function to get all grn data using GRN_NO
export const getGRNDetailsByNo = async (GRN_NO) => {
  try {
    const grnItem = await grn.findOne({
      where: { GRN_NO },
      raw: true,
    });
    if (!grnItem) {
      throw new Error("GRN not found");
    }
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

    const productGRNs = await productGRN.findAll({
      where: { GRN_NO },
      attributes: [
        "batchNo",
        "productId",
        "totalQty",
        "sellingPrice",
        "purchasePrice",
        "freeQty",
        "expDate",
        "amount",
        "comment",
      ],
      raw: true,
    });
    console.log("ProductGRN details:", productGRNs);
    const productGRNsWithDetails = await Promise.all(
      productGRNs.map(async (productGRN) => {
        const product = await products.findOne({
          where: { productId: productGRN.productId },
          raw: true,
        });
        if (!product) {
          throw new Error(
            "Product not found for productId: " + productGRN.productId
          );
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
      })
    );
    // Format the final result
    const result = {
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt,
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
      productGRNs: productGRNsWithDetails,
    };
    return result;
  } catch (error) {
    console.error("Error fetching GRN details:", error);
    throw new Error("Failed to fetch GRN details");
  }
};

//Function to get all grn data
export const getAllGRNDetails = async () => {
  try {
    const allGRNs = await grn.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    if (!allGRNs || allGRNs.length === 0) {
      throw new Error("No GRNs found");
    }
    const supplierIds = allGRNs.map((grn) => grn.supplierId);
    const suppliersData = await suppliers.findAll({
      where: { supplierId: supplierIds },
      raw: true,
    });
    if (!suppliersData || suppliersData.length === 0) {
      throw new Error("No suppliers found for GRNs");
    }
    const branchIds = allGRNs.map((grn) => grn.branchId);
    const branchesData = await branches.findAll({
      where: { branchId: branchIds },
      raw: true,
    });
    if (!branchesData || branchesData.length === 0) {
      throw new Error("No branches found for GRNs");
    }
    const grnNumbers = allGRNs.map((grn) => grn.GRN_NO);
    const productGRNs = await productGRN.findAll({
      where: { GRN_NO: grnNumbers },
      attributes: [ "GRN_NO","batchNo","productId","totalQty", "sellingPrice","purchasePrice","freeQty","expDate", "amount", "comment",],
      raw: true,
      
    });
    const productGRNsWithDetails = await Promise.all(
      productGRNs.map(async (productGRN) => {
        const productData = await products.findOne({
          where: { productId: productGRN.productId },
          raw: true,
        });
        if (!productData) {
          throw new Error(
            "Product not found for productId: " + productGRN.productId
          );
        }
        return {
          GRN_NO: productGRN.GRN_NO,
          productId: productGRN.productId,
          productName: productData.productName,
          batchNo: productGRN.batchNo,
          totalQty: productGRN.totalQty,
          sellingPrice: productGRN.sellingPrice,
          purchasePrice: productGRN.purchasePrice,
          freeQty: productGRN.freeQty,
          expDate: productGRN.expDate,
          amount: productGRN.amount,
          comment: productGRN.comment,
        };
      })
    );
    const results = allGRNs.map((grnItem) => {
      const supplier = suppliersData.find(
        (s) => s.supplierId === grnItem.supplierId
      );
      const branch = branchesData.find((b) => b.branchId === grnItem.branchId);
      const filteredProductGRNs = productGRNsWithDetails.filter(
        (productGRN) => productGRN.GRN_NO === grnItem.GRN_NO
      );

      return {
        GRN_NO: grnItem.GRN_NO,
        createdAt: grnItem.createdAt,
        branchName: branch ? branch.branchName : "Unknown Branch",
        supplierName: supplier ? supplier.supplierName : "Unknown Supplier",
        supplierId: grnItem.supplierId,
        invoiceNo: grnItem.invoiceNo,
        productGRNs: filteredProductGRNs,
      };
    });
    return results;
  } catch (error) {
    console.error("Error fetching all GRN details:", error);
    throw new Error("Failed to fetch all GRN details");
  }
};
