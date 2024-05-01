import { v4 as uuidv4 } from 'uuid';
import products from "../product/product.js";
import grn from "../GRN/grn.js";
import suppliers from "../supplier/supplier.js";
import { mapSupplierNameToId } from "../../modules/supplier/service.js"; 
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branches from "../branch/branch.js";
//import suppliers from "../supplier/supplier.js";


// Function to generate GRN number
const generateGRNNumber = async (branchName) => {
  try {
    // Extract the first three letters of the branch name
    const branchCode = branchName.substring(0, 3).toUpperCase();

    // Get the last GRN number from the database
    const lastGRN = await getLastGRNNumber();
    let lastNumber = 0; // Default to 0 if no previous GRN exists

    if (lastGRN) {
      lastNumber = parseInt(lastGRN.split('GRN')[1]); // Extract the number part
      if (isNaN(lastNumber)) {
        throw new Error("Invalid GRN number format");
      }
    }

    // Increment the last number
    lastNumber++;

    // Pad the number with leading zeros
    const paddedNumber = lastNumber.toString().padStart(5, '0');

    // Construct the GRN number
    const GRN_NO = `${branchCode}-GRN${paddedNumber}`;

    return GRN_NO;
  } catch (error) {
    throw new Error("Error generating GRN number: " + error.message);
  }
};


// Function to get the last GRN number from the database
const getLastGRNNumber = async () => {
  try {
    // Fetch the latest GRN entry from the database
    const latestGRN = await grn.findOne({
      order: [['createdAt', 'DESC']] // Order by creation date in descending order to get the latest entry
  });

  // Extract and return the GRN number
  return latestGRN ? latestGRN.GRN_NO : null; // Return null if there are no GRN entries in the database

  } catch (error) {
    throw new Error("Error getting last GRN number: " + error.message);
  }
};

const extractCounterFromGRN = (GRN_NO) => {
  if (GRN_NO) {
    // Assuming the GRN number format is "GAL-GRNXXXX", where XXXX represents the counter value
    const parts = GRN_NO.split('-');
    if (parts.length === 2) {
      const counter = parseInt(parts[1]); // Extract the counter part
      if (!isNaN(counter)) {
        return counter;
      }
    }
  }
  throw new Error("Invalid GRN number format");
};

// Function to add a GRN
export const addGRN = async (grnData, supplierName, branchName) => {
  try {
    const GRN_NO = await generateGRNNumber(grnData.branchName); // Generate GRN number
    grnData.GRN_NO = GRN_NO; // Assign GRN number to grnData

    const supplierId = await mapSupplierNameToId(supplierName);
    if (!supplierId) {
      return res.status(404).json({ error: "Supplier not found" });
    }
  
    const branchId = await mapBranchNameToId(branchName);
    if (!branchId) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    grnData.supplierId = supplierId;
    grnData.branchId = branchId;

    const newGRN = await grn.create(grnData); // Assuming 'grn' model has a 'create' method
    return newGRN;
  } catch (error) {
    console.error("Error creating GRN:", error);
    throw new Error("Error creating GRN: " + error.message);
  }
};




// Function to get all GRNs
export const getAllGRNs = async () => {
  try {
    const grnAll = await grn.findAll({
      include: [
        { model: branches, as: 'branch', attributes: ['branchName'] },
        { model: suppliers, as: 'supplier', attributes: ['supplierName'] }
      ]
    });
    return grnAll;
  } catch (error) {
    throw new Error("Error fetching stocks: " + error.message);
  }
};


// Function to get a GRN by its ID
export const getGRNById = async (GRN_NO) => {
  try {
    const grnData = await grn.findByPk(GRN_NO, {
      include: [
        { model: branches, as: 'branch', attributes: ['branchName'] },
        { model: suppliers, as: 'supplier', attributes: ['supplierName'] }
      ]});
    return grnData;
  } catch (error) {
    throw new Error("Error fetching stock: " + error.message);
  }
};
// Function to get GRNs by invoice number
export const getGRNByInvoiceNo = async (invoiceNo) => {
  try {
    // Find GRN entries by invoice number and include associated branch and supplier
    const grnReq = await grn.findAll({
      where: { invoiceNo },
      include: [
        { model: branches, attributes: ['branchName'] }, // Include branch and select branchName attribute
        { model: suppliers, attributes: ['supplierName'] } // Include supplier and select supplierName attribute
      ]
    });

    return grnReq;
  } catch (error) {
    console.error("Error retrieving stocks:", error);
    throw new Error("Error retrieving stocks");
  }
};
// Function to get GRN details based on provided criteria
// export const getGRNDetails = async ({
//   invoiceNo,
//   productId,
//   productName,
//   supplierId,
//   supplierName,
// }) => {
//   try {
//     let whereClause = {};

//     for (const key in {
//       invoiceNo,
//       productId,
//       productName,
//       supplierId,
//       supplierName,
//     }) {
//       switch (key) {
//         case "invoiceNo":
//         case "productId":
//         case "productName":
//         case "supplierId":
//         case "supplierName":
//           if (eval(key)) {
//             whereClause[key] = eval(key);
//           }
//           break;
//       }
//     }

//     const stockDetails = await grn.findAll({ where: whereClause });
//     return stockDetails;
//   } catch (error) {
//     console.error("Error retrieving stock details:", error);
//     throw new Error("Error retrieving stock details");
//   }
// };

// Function to query GRN data by productId from the grn table
const getGRNDataByProductId = async (productId) => {
  try {
    // Assuming you have a model named grn with appropriate associations
    const grnData = await grn.findAll({
      include: [
        {
          model: product_GRN,
          where: { productId: productId }
        }
      ]
    });
    return grnData;
  } catch (error) {
    throw new Error("Error fetching GRN data by productId: " + error.message);
  }
};

export const getGRNByProductId = async (productId) => {
  try {
    const grnData = await getGRNDataByProductId(productId);
    return grnData;
  } catch (error) {
    console.error("Error fetching GRN data by productId:", error);
    throw new Error("Error fetching GRN data by productId");
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


// Service function to retrieve details by invoice number
export const getDetailsByInvoiceNoService = async (invoiceNo) => {
  try {
    // Assuming you have models for GRN and Product_GRN
    const grnEntry = await grn.findOne({ where: { invoiceNo } });
    
    if (!grnEntry) {
      throw new Error("GRN entry with the provided invoice number not found");
    }
    
    // Find all product GRNs associated with the GRN entry
    const productGRNs = await productGRN.findAll({ where: { GRN_NO: grnEntry.GRN_NO } });
    
    // Map product GRNs to desired details
    const details = productGRNs.map(productGRN => ({
      invoiceNo: grnEntry.invoiceNo,
      supplierName: grnEntry.supplierName,
      branchName: grnEntry.branchName,
      productId: productGRN.productId,
      productName: productGRN.productName,
      batchNo: productGRN.batchNo,
      totalQty: productGRN.totalQty,
      purchasePrice: productGRN.purchasePrice,
      sellingPrice: productGRN.sellingPrice,
      freeQty: productGRN.freeQty,
      expDate: productGRN.expDate,
      comment: productGRN.comment
    }));
    
    return details;
  } catch (error) {
    throw new Error("Error retrieving details by invoice number: " + error.message);
  }
};


