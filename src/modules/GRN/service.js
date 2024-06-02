import { v4 as uuidv4 } from 'uuid';
import products from "../product/product.js";
import grn from "../GRN/grn.js";
import suppliers from "../supplier/supplier.js";
import { mapSupplierNameToId } from "../../modules/supplier/service.js"; 
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branches from "../branch/branch.js";
import productGRN from '../product_GRN/product_GRN.js';
import { Op } from 'sequelize';



// Function to generate GRN number
const generateGRNNumber = async (branchName) => {
  try {
    if (!branchName || typeof branchName !== 'string') {
      throw new Error("Invalid branchName: " + branchName);
    }

    // Extract the first three letters of the branch name
    const branchCode = branchName.substring(0, 3).toUpperCase();

    // Get the last GRN number for the specific branch from the database
    const lastGRN = await getLastBranchGRNNumber(branchCode);
    let lastNumber = 0; // Default to 0 if no previous GRN exists for the branch

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

// Function to get the last GRN number for a specific branch from the database
const getLastBranchGRNNumber = async (branchCode) => {
  try {
    // Fetch the latest GRN entry for the specific branch from the database
    const latestGRN = await grn.findOne({
      where: {
        GRN_NO: {
          [Op.startsWith]: `${branchCode}-GRN`
        }
      },
      order: [['createdAt', 'DESC']] // Order by creation date in descending order to get the latest entry
    });

    // Extract and return the GRN number
    return latestGRN ? latestGRN.GRN_NO : null; // Return null if there are no GRN entries for the branch in the database

  } catch (error) {
    throw new Error("Error getting last GRN number for branch: " + error.message);
  }
};



 

//Function to create GRN 
export const addGRN = async (invoiceNo, supplierId, branchName) => {
  try {
    const GRN_NO = await generateGRNNumber(branchName); // Generate GRN number

    const branchId = await mapBranchNameToId(branchName);

    if (!branchId) {
      res.status(404).json({ error: "Branch not found" });
      return;
    }

    // Create new GRN entry
    const grndata = await grn.create({
      invoiceNo,
      supplierId,
      branchId,
      GRN_NO,
    });

    return grndata;
  } catch (error) {
    throw new Error('Error creating GRN entry: ' + error.message);
  }
};



// Function to get all GRNs
export const getAllGRNs = async () => {
  try {
    const grnAll = await grn.findAll();
    console.log("data", grnAll);

    const result = await Promise.all(grnAll.map(async (grnItem) => {
      const supplier = await suppliers.findOne({
        where: { supplierId: grnItem.supplierId },
      });

      if (!supplier) {
        throw new Error("Supplier not found for GRN_NO: " + grnItem.GRN_NO);
      }

      const branch = await branches.findOne({
        where: { branchId: grnItem.branchId },
      });

      if (!branch) {
        throw new Error("Branch not found for GRN_NO: " + grnItem.GRN_NO);
      }

      return {
        GRN_NO: grnItem.GRN_NO,
        createdAt: grnItem.createdAt, // This should be replaced with the actual productId if available
        branchName: branch.branchName,
        supplierName: supplier.supplierName,
        invoiceNo: grnItem.invoiceNo,
      };
    }));

    return result;
  } catch (error) {
    throw new Error("Error fetching stocks: " + error.message);
  }
};




//Function to get GRN by GRN_NO
export const getGRNById = async (GRN_NO) => {
  
  try {
    const grnItem = await grn.findOne({
      where: { GRN_NO },
    });

    if (!grnItem) {
      throw new Error("GRN not found");
    }

    const supplier = await suppliers.findOne({
      where: { supplierId: grnItem.supplierId },
    });

    if (!supplier) {
      throw new Error("Supplier not found for GRN_NO: " + GRN_NO);
    }

    const branch = await branches.findOne({
      where: { branchId: grnItem.branchId },
    });

    if (!branch) {
      throw new Error("Branch not found for GRN_NO: " + GRN_NO);
    }

    const result = {
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt, // This should be replaced with the actual productId if available
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
    };

    return result;
  } catch (error) {
    throw new Error("Error fetching GRN: " + error.message);
  }
};




// Function to get GRNs by invoice number
export const getGRNByInvoiceNo = async (invoiceNo) => {
  
  try {
    const grnItem = await grn.findOne({
      where: { invoiceNo },
    });

    if (!grnItem) {
      throw new Error("GRN not found");
    }

    const supplier = await suppliers.findOne({
      where: { supplierId: grnItem.supplierId },
    });

    if (!supplier) {
      throw new Error("Supplier not found for GRN_NO: " + GRN_NO);
    }

    const branch = await branches.findOne({
      where: { branchId: grnItem.branchId },
    });

    if (!branch) {
      throw new Error("Branch not found for GRN_NO: " + GRN_NO);
    }

    const result = {
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt, // This should be replaced with the actual productId if available
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
    };

    return result;
  } catch (error) {
    throw new Error("Error fetching GRN: " + error.message);
  }
};




// Function to query GRN data by supplierId
export const getGRNBySupplierId = async (supplierId) => {
  try {
    const grnItems = await grn.findAll({
      where: { supplierId },
    });

    if (!grnItems || grnItems.length === 0) {
      throw new Error("No GRNs found for this supplier");
    }

    const supplier = await suppliers.findOne({
      where: { supplierId },
    });

    if (!supplier) {
      throw new Error("Supplier not found for supplierId: " + supplierId);
    }

    const results = await Promise.all(grnItems.map(async (grnItem) => {
      const branch = await branches.findOne({
        where: { branchId: grnItem.branchId },
      });

      if (!branch) {
        throw new Error("Branch not found for GRN_NO: " + grnItem.GRN_NO);
      }

      return {
        GRN_NO: grnItem.GRN_NO,
        createdAt: grnItem.createdAt, // This should be replaced with the actual productId if available
        branchName: branch.branchName,
        supplierName: supplier.supplierName,
        invoiceNo: grnItem.invoiceNo,
      };
    }));

    return results;
  } catch (error) {
    throw new Error("Error fetching GRNs: " + error.message);
  }
};




//Function to get GRN by branchId
export const getGRNByBranchId = async (branchId) => {
  try {
    // Fetch all GRNs associated with the branchId
    const grnItems = await grn.findAll({
      where: { branchId },
      attributes: ['GRN_NO', 'createdAt', 'supplierId', 'invoiceNo'],
      raw: true,
    });

    if (!grnItems || grnItems.length === 0) {
      throw new Error(`No GRNs found for branchId: ${branchId}`);
    }

    // Fetch details for each GRN_NO
    const results = await Promise.all(grnItems.map(async (grnItem) => {
      const { GRN_NO, supplierId } = grnItem;

      // Get supplier details
      const supplier = await suppliers.findOne({
        where: { supplierId },
        attributes: ['supplierName'],
        raw: true,
      });

      if (!supplier) {
        throw new Error(`Supplier not found for supplierId: ${supplierId}`);
      }

      // Get branch details
      const branch = await branches.findOne({
        where: { branchId },
        attributes: ['branchName'],
        raw: true,
      });

      if (!branch) {
        throw new Error(`Branch not found for branchId: ${branchId}`);
      }

      return {
        GRN_NO,
        createdAt: grnItem.createdAt,
        branchName: branch.branchName,
        supplierName: supplier.supplierName,
        invoiceNo: grnItem.invoiceNo,
      };
    }));

    return results;
  } catch (error) {
    console.error('Error fetching GRN details by branchId:', error);
    throw new Error('Error fetching GRN details by branchId: ' + error.message);
  }
};




//Function to get GRN data by branchName and supplierId
export const getGRNsByBranchAndSupplier = async (branchName, supplierId) => {
  try {
    const branch = await branches.findOne({
      where: { branchName }
    });

    if (!branch) {
      throw new Error('Branch not found for branchName: ' + branchName);
    }

    const supplier = await suppliers.findOne({
      where: { supplierId }
    });

    if (!supplier) {
      throw new Error('Supplier not found for supplierId: ' + supplierId);
    }

    const grnItems = await grn.findAll({
      where: {
        branchId: branch.branchId,
        supplierId: supplier.supplierId
      }
    });

    if (!grnItems || grnItems.length === 0) {
      throw new Error('No GRNs found for this branch and supplier');
    }

    const results = grnItems.map(grnItem => ({
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt,
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
    }));

    return results;
  } catch (error) {
    throw new Error('Error fetching GRNs: ' + error.message);
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




























// //function to get grn by branchName and productId
// export const getGRNsByBranchNameService = async (branchName) => {

//   try {

//     const branch = await branches.findOne({
//       where: { branchName }
//     });

//     if (!branch) {
//       throw new Error('Branch not found for branchName: ' + branchName);
//     }
//     // Fetch GRNs for the given branchName
//     const grnItems = await grn.findAll({
//         where: {
//           branchId: branch.branchId,
//          },
//         attributes: ['GRN_NO', 'createdAt', 'supplierId', 'invoiceNo'],
//         raw: true,
//       });
  
//       if (!grnItems || grnItems.length === 0) {
//         throw new Error(`No GRNs found for branchId: ${branchId}`);
//       }
  
//       // Fetch details for each GRN_NO
//       const results = await Promise.all(grnItems.map(async (grnItem) => {
//         const { GRN_NO, supplierId } = grnItem;
  
//         // Get supplier details
//         const supplier = await suppliers.findOne({
//           where: { supplierId },
//           attributes: ['supplierName'],
//           raw: true,
//         });
  
//         if (!supplier) {
//           throw new Error(`Supplier not found for supplierId: ${supplierId}`);
//         }
      
//     });

//     return grnItems;
//   } catch (error) {
//     console.error('Error in getGRNsByBranchNameService:', error);
//     throw new Error('Failed to fetch GRNs by branchName');
//   }
// };







// Service function to retrieve details by invoice number
// export const getDetailsByInvoiceNoService = async (invoiceNo) => {
//   try {
//     // Assuming you have models for GRN and Product_GRN
//     const grnEntry = await grn.findOne({ where: { invoiceNo } });
    
//     if (!grnEntry) {
//       throw new Error("GRN entry with the provided invoice number not found");
//     }
    
//     // Find all product GRNs associated with the GRN entry
//     const productGRNs = await productGRN.findAll({ where: { GRN_NO: grnEntry.GRN_NO } });
    
//     // Map product GRNs to desired details
//     const details = productGRNs.map(productGRN => ({
//       invoiceNo: grnEntry.invoiceNo,
//       supplierName: grnEntry.supplierName,
//       branchName: grnEntry.branchName,
//       productId: productGRN.productId,
//       productName: productGRN.productName,
//       batchNo: productGRN.batchNo,
//       totalQty: productGRN.totalQty,
//       purchasePrice: productGRN.purchasePrice,
//       sellingPrice: productGRN.sellingPrice,
//       freeQty: productGRN.freeQty,
//       expDate: productGRN.expDate,
//       comment: productGRN.comment
//     }));
    
//     return details;
//   } catch (error) {
//     throw new Error("Error retrieving details by invoice number: " + error.message);
//   }
// };













