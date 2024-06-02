import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import productGRN from "../product_GRN/product_GRN.js";
import grn from "../GRN/grn.js";
import products from "../product/product.js";
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branches from "../branch/branch.js";
import categories from '../category/category.js';
import suppliers from "../supplier/supplier.js";
import productBatchSum from "../productBatchSum/productBatchSum.js";

//=================================================
export const getAllProductGRN = async () => {
  try{
      const branchReq = await productGRN.findAll();
      console.log(branchReq);
      return branchReq;
  }catch (error) {
      console.error('Error retrieving branches:', error);
      throw new Error('Error retrieving branches');
  }
};
//===============================================

//create product_GRN
// export const createProductGRNService = async ({
//   productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment
// }) => {
//   try {
//     const newProductGRN = await productGRN.create({
//       productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment
//     });
//     return newProductGRN;
//   } catch (error) {
//     if (error.name === 'SequelizeValidationError') {
//       throw new Error("Validation error: " + error.message);
//     } else {
//       throw new Error("Error creating product supplier: " + error.message);
//     }
//   }
// }; 

// export const createProductGRNService = async (productGRNEntries) => {
//   try {
//     if (!Array.isArray(productGRNEntries)) {
//       throw new Error("productGRNEntries should be an array");
//     }

//     const newProductGRNs = await Promise.all(productGRNEntries.map(async (entry) => {
//       return await productGRN.create(entry);
//     }));
//     return newProductGRNs;
//   } catch (error) {
//     if (error.name === 'SequelizeValidationError') {
//       console.error("Validation error details:", error.errors);
//       throw new Error("Validation error: " + JSON.stringify(error.errors));
//     } else {
//       throw new Error("Error creating product supplier: " + error.message);
//     }
//   }
// };

// export const createProductGRNService = async (productGRNEntries) => {
//   try {
//     if (!Array.isArray(productGRNEntries)) {
//       throw new Error("productGRNEntries should be an array");
//     }

//     const newProductGRNs = await Promise.all(productGRNEntries.map(async (entry) => {
//       return await productGRN.create(entry);
//     }));
//     return newProductGRNs;
//   } catch (error) {
//     if (error.name === 'SequelizeValidationError') {
//       console.error("Validation error details:", error.errors);
//       throw new Error("Validation error: " + JSON.stringify(error.errors));
//     } else {
//       throw new Error("Error creating product supplier: " + error.message);
//     }
//   }
// };

// 

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
          throw error; // Throw the validation error to catch it in the controller
        } else {
          console.error("Error creating entry:", entry, error);
          throw error; // Re-throw other errors
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
        totalAmount += productGRN.amount;
      }
    }

    return totalAmount;
  } catch (error) {
    throw new Error("Error calculating total amount: " + error.message);
  }
};








//function to get grn data using productId
export const getGRNDetailsByProductId = async (productId) => {
  try {
    // Get GRN_NOs associated with the productId from productGRN table
    const productGRNs = await productGRN.findAll({
      where: { productId },
      attributes: ['GRN_NO'], // Select only the GRN_NO column
      raw: true, // Return plain objects
    });

    // Fetch details for each GRN_NO
    const results = await Promise.all(productGRNs.map(async (productGRNItem) => {
      const { GRN_NO } = productGRNItem;

      // Get details from grn table for the current GRN_NO
      const grnItem = await grn.findOne({
        where: { GRN_NO },
        attributes: ['GRN_NO', 'createdAt', 'branchId', 'supplierId', 'invoiceNo'],
        raw: true,
      });

      if (!grnItem) {
        throw new Error(`GRN not found for GRN_NO: ${GRN_NO}`);
      }

      // Get supplier details
      const supplier = await suppliers.findOne({
        where: { supplierId: grnItem.supplierId },
        attributes: ['supplierName'],
        raw: true,
      });

      if (!supplier) {
        throw new Error(`Supplier not found for supplierId: ${grnItem.supplierId}`);
      }

      // Get branch details
      const branch = await branches.findOne({
        where: { branchId: grnItem.branchId },
        attributes: ['branchName'],
        raw: true,
      });

      if (!branch) {
        throw new Error(`Branch not found for branchId: ${grnItem.branchId}`);
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



































// //function to get grn data using branchName and productId
// export const getProductGRNDataByProductIdAndGRNNOService = async (productId, grnNo) => {
//   try {
//     // Get productGRN details for the given productId and GRN_NO
//     const productGRNData = await productGRN.findAll({
//       where: {
//         productId,
//         GRN_NO: grnNo,
//       },
//     });

//     return productGRNData;
//   } catch (error) {
//     console.error('Error in getProductGRNDataByProductIdAndGRNNOService:', error);
//     throw new Error('Failed to fetch productGRN data by productId and GRN_NO');
//   }
// };




// export const updateProductQty = async (productIds) => {
//   try {
//     // Fetch the total available quantity for each productId, excluding expired products
//     const productsToUpdate = await productGRN.findAll({
//       attributes: ['productId', [sequelize.fn('SUM', sequelize.col('availableQty')), 'totalAvailableQty']],
//       where: {
//         productId: productIds,
//         [Op.or]: [
//           { expDate: null },
//           { expDate: { [Op.gte]: new Date() } }
//         ]
//       },
//       group: ['productId']
//     });

//     // Iterate through each product and update its qty in the products table
//     for (const product of productsToUpdate) {
//       const { productId, totalAvailableQty } = product.dataValues;

//       await products.update(
//         { qty: totalAvailableQty },
//         { where: { productId } }
//       );

//       console.log(`Updated qty for productId ${productId} to ${totalAvailableQty}`);
//     }
//   } catch (error) {
//     console.error("Error updating product quantity:", error);
//     throw error;
//   }
// };





// //function to get active stock
// export const getProductTotalQuantity = async (branchName, productId) => {
//   try {
//     // Retrieve product details including total quantity
//     const productDetails = await products.findOne({
//       where: { productId },
//       include: [
//         {
//           model: branches,
//           where: { branchName },
//           attributes: ['branchName'], 
//         },
//         {
//           model: categories, 
//           attributes: ['categoryName'], 
//         },
//       ],
//       attributes: ['productId', 'productName', 'qty'], 

//     });

//     if (productDetails) {
//       return productDetails;
//     } else {
//       return 0; 
//     }
//   } catch (error) {
//     throw error;
//   }
// };


// export const getGRNDetailsByGRNNOAndProductIdService = async (grnNos, productId, branchName) => {
//   try {
//     const productGRNData = await productGRN.findAll({
//       where: {
//         GRN_NO: grnNos,
//         productId,
//       },
//     });

//     return {
//       GRN_NO: grnNos.GRN_NO,
//       createdAt: grnNos.createdAt,
//       branchName: branchName,
//       supplierName: supplier.supplierName,
//       invoiceNo: grnItem.invoiceNo,
//     };

//     return productGRNData;
//   } catch (error) {
//     console.error('Error in getGRNDetailsByGRNNOAndProductIdService:', error);
//     throw new Error('Failed to fetch productGRN details by GRN_NO and productId');
//   }
// };



// export const getProductGRNAvailableQuantity = async (branchName, productName) => {
//   try {
//     const productGRNDetails = await productGRN.findAll({
//       where: { 
//         batchNo: { [Op.ne]: null }, // Exclude records with null batchNo
//         expDate: { [Op.gte]: new Date() }, // Filter out records with expired stock
//       },
//       include: [
//         {
//           model: products,
//           where: { productName },
//           include: {
//             model: branches,
//             where: { branchName },
//           },
//         },
//       ],
//     });

//     // Prepare an array to hold batch-wise availability details
//     const availabilityDetails = [];

//     // Iterate over product_GRN records to calculate available quantity per batch
//     for (const productGRN of productGRNDetails) {
//       availabilityDetails.push({
//         batchNo: productGRN.batchNo,
//         expDate: productGRN.expDate,
//         availableQty: productGRN.availableQty,
//       });
//     }

//     return availabilityDetails;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getProductGRNAvailableQuantity = async (branchName, productName) => {
//   try {
//     const productGRNDetails = await productGRN.findAll({
//       where: { 
//         batchNo: { [Op.ne]: null }, // Exclude records with null batchNo
//         expDate: { [Op.gte]: new Date() }, // Filter out records with expired stock
//       },
//       include: [
//         {
//           model: products,
//           where: { productName },
//           include: {
//             model: branches,
//             where: { branchName },
//           },
//         },
//       ],
//     });

//     // Calculate total available quantity
//     let totalQuantity = 0;
//     for (const productGRN of productGRNDetails) {
//       totalQuantity += productGRN.availableQty;
//     }

//     return { totalQuantity };
//   } catch (error) {
//     throw error;
//   }
// };







// export const getProductGRNAvailableQuantity = async (branchName, productName) => {
//   try {
//     const productGRNDetails = await productGRN.findAll({
//       where: { 
//         batchNo: { [Op.ne]: null }, // Exclude records with null batchNo
//         expDate: { [Op.gte]: new Date() }, // Filter out records with expired stock
//       },
//       include: [
//         {
//           model: products,
//           where: { productName },
//           include: {
//             model: branches,
//             where: { branchName },
//           },
//         },
//       ],
//     });

//     // Prepare an array to hold batch-wise availability details
//     const availabilityDetails = [];

//     // Iterate over product_GRN records to calculate available quantity per batch
//     for (const productGRN of productGRNDetails) {
//       availabilityDetails.push({
//         batchNo: productGRN.batchNo,
//         expDate: productGRN.expDate,
//         availableQty: productGRN.availableQty,
//       });
//     }

//     return availabilityDetails;
//   } catch (error) {
//     throw error;
//   }
// };