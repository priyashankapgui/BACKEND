import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import productGRN from "../product_GRN/product_GRN.js";
import grn from "../GRN/grn.js";
import products from "../product/product.js";
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branches from "../branch/branch.js";
import categories from '../category/category.js';



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




// Service function to calculate total amount by invoice number
export const calculateTotalAmount = async (invoiceNo) => {
  try {
    
    const grnEntries = await grn.findAll({ where: { invoiceNo } });

    if (!grnEntries || grnEntries.length === 0) {
      throw new Error("No GRN entries found with the provided invoice number");
    }

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



// Service function to retrieve batch details by productName and branchNo
export const getBatchDetailsByProductName = async (productName, branchName) => {
  try {

    const branchId = await mapBranchNameToId(branchName);
    if (!branchId) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const product = await products.findOne({
      where: { productName, branchId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const productGRNs = await productGRN.findAll({
      where: { productId: product.productId },
    });

    // Extract batch details from the product GRNs
    const batchDetails = productGRNs.map((productGRN) => ({
      branchName: branches.branchName,
      batchNo: productGRN.batchNo,
      expDate: productGRN.expDate,
      sellingPrice: productGRN.sellingPrice,
    }));

    return (batchDetails);
  } catch (error) {
    throw new Error("Error retrieving batch details: " + error.message);
  }
}; 



//update the qty column in thr product table
export const updateProductQty = async (productId) => {
  try {
    const productGRNs = await productGRN.findAll({
      where: {
        productId: productId
      }
    });

    let totalAvailableQty = 0;
    for (const productGRN of productGRNs) {
      if (!productGRN.expDate || productGRN.expDate >= new Date()) {
        totalAvailableQty += productGRN.availableQty;
      }
    }


    // Update the qty column in the product table
    await products.update(
      { qty: totalAvailableQty },
      { where: { productId: productId } }
    );

    console.log(`Updated qty for productId ${productId} to ${totalAvailableQty}`);
  } catch (error) {
    console.error("Error updating product quantity:", error);
    throw error;
  }
};




export const getProductTotalQuantity = async (branchName, productName) => {
  try {
    // Retrieve product details including total quantity
    const productDetails = await products.findOne({
      where: { productName },
      include: [
        {
          model: branches,
          where: { branchName },
          attributes: ['branchName'], 
        },
        {
          model: categories, 
          attributes: ['categoryName'], 
        },
      ],
      attributes: ['productId', 'productName', 'qty'], 

    });

    if (productDetails) {
      return productDetails;
    } else {
      return 0; 
    }
  } catch (error) {
    throw error;
  }
};






export const getProductGRNAvailableQuantity = async (branchName, productName) => {
  try {
    const productGRNDetails = await productGRN.findAll({
      where: { 
        batchNo: { [Op.ne]: null }, // Exclude records with null batchNo
        expDate: { [Op.gte]: new Date() }, // Filter out records with expired stock
      },
      include: [
        {
          model: products,
          where: { productName },
          include: {
            model: branches,
            where: { branchName },
          },
        },
      ],
    });

    // Prepare an array to hold batch-wise availability details
    const availabilityDetails = [];

    // Iterate over product_GRN records to calculate available quantity per batch
    for (const productGRN of productGRNDetails) {
      availabilityDetails.push({
        batchNo: productGRN.batchNo,
        expDate: productGRN.expDate,
        availableQty: productGRN.availableQty,
      });
    }

    return availabilityDetails;
  } catch (error) {
    throw error;
  }
};



export const adjustProductGRNQuantity = async (productName, branchName, batchNo, newQuantity) => {
  try {
    const productGRNRecord = await productGRN.findOne({
      where: {
        batchNo,
      },
      include: [
        {
          model: products,
          where: { productName },
          include: {
            model: branches,
            where: { branchName },
          },
        },
      ],
    });

    if (!productGRNRecord) {
      throw new Error("Product GRN record not found.");
    }

  

    // Update the availableQty with the newQuantity
    productGRNRecord.availableQty = newQuantity;
    await productGRNRecord.save();

    return true; 
  } catch (error) {
    throw error;
  }
};