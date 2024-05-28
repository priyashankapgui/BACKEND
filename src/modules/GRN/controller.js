import {
  addGRN,
  getAllGRNs,
  getGRNById,
  getGRNByInvoiceNo,
  //getGRNDetails,
  updateGRNById,
  deleteGRNById,
  getGRNBySupplierId,
  getDetailsByInvoiceNoService,
  getGRNByBranchId
  //getTotalAmountByInvoiceNoService
} from "../GRN/service.js";
import { createProductGRNService, getGRNDetailsByProductId } from "../../modules/product_GRN/service.js";
import { calculateTotalAmount, updateProductQty } from '../../modules/product_GRN/service.js'; 
import suppliers from "../supplier/supplier.js";
import branches from "../branch/branch.js";



// Function to create GRN and Product_GRN
// export const createGRNAndProduct = async (req, res) => {
//   try {
//     console.log('Request query parameters:', req.body);
//     const { invoiceNo, supplierName, branchName, productId, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, comment } = req.body;
    
//     if (!branchName || typeof branchName !== 'string') {
//       return res.status(400).json({ error: "Invalid branchName" });
//     }

//     const grnData = {
//       invoiceNo,
//       supplierName,
//       branchName
//     };
//     const newGRN = await addGRN(grnData, supplierName, branchName); 
//     const GRN_NO = newGRN.GRN_NO; 

//     const productGRNData = {
//       productId,
//       GRN_NO,
//       batchNo,
//       totalQty,
//       purchasePrice,
//       sellingPrice,
//       freeQty,
//       expDate,
//       amount: (totalQty - freeQty) * purchasePrice, 
//       comment
//     };
//     const newProductGRN = await createProductGRNService(productGRNData); 

    
//     await updateProductQty(productId);
    
//     res.status(201).json({
//       GRN: newGRN,
//       Product_GRN: newProductGRN
//     });
//   } catch (error) {
//     console.error("Error creating GRN and Product_GRN:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const createGRNAndProduct = async (req, res) => {
//   const { invoiceNo, supplierName, branchName, entries } = req.body;

//   console.log('Received supplierName from:', supplierName);
//     console.log('Received branchName from:', branchName);

//   if (!branchName || typeof branchName !== 'string') {
//           return res.status(400).json({ error: "Invalid branchName" });
//         }
//         const grnData = {
//                 invoiceNo,
//                 supplierName,
//                 branchName
//               };

//   try {
    

//     console.log('Received supplierName from 2:', supplierName);
//     console.log('Received branchName from 2:', branchName);
//     console.log('Received branchName from 2:', invoiceNo);

//     const newGRN = await addGRN({ grnData});

//     // Add GRN_NO to each entry
//     const productGRNEntries = entries.map(entry => ({
//       ...entry,
//       GRN_NO: newGRN.GRN_NO
//     }));

//     // Create Product GRNs
//     await createProductGRNService(productGRNEntries);

//     res.status(201).json({ message: 'GRN and Product GRNs created successfully' });
//   } catch (error) {
//     console.error("Error creating GRN and Product_GRN:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// 

//Function to create GRN 
export const createGRNAndProduct = async (req, res) => {
  try {
    const { invoiceNo, supplierId, branchName, products } = req.body;

    // Create GRN entry
    const grndata = await addGRN(invoiceNo, supplierId, branchName);

    // Extract GRN_NO
    const { GRN_NO } = grndata;

    // Create ProductGRN entries
    const productGRNs = products.map(product => ({
      GRN_NO,
      productId: product.productId,
      batchNo: product.batchNo,
      totalQty: product.totalQty,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      freeQty: product.freeQty,
      amount: product.amount,
      expDate: product.expDate,
      availableQty: product.availableQty,
      comment: product.comment,
    }));

    console.log('ProductGRNs to insert:', productGRNs);

    const result = await createProductGRNService(productGRNs);

    

    if (result.success) {

      const productIds = [...new Set(productGRNs.map(product => product.productId))];
      await updateProductQty(productIds);

      res.status(201).json({ message: 'GRN and productGRN entries created successfully', newProductGRNs: result.newProductGRNs });
    } else {
      res.status(400).json({ message: 'Validation error creating productGRN entries' });
    }
  } catch (error) {
    console.error('Error creating GRN and productGRN entries:', error);

    res.status(500).json({ message: 'Failed to create GRN and productGRN entries' });
  }
};





// Controller function to get all GRNs
export const getGRNs = async (req, res) => {
  try {
    const result = await getAllGRNs();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller function to get a GRN by its GRN_NO
export const getGRN = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;
  console.log("GRN",GRN_NO);
  try {
    const grnData = await getGRNById(GRN_NO);
    if (!grnData) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    res.status(200).json(grnData);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller function to get GRNs by invoice number
export const getGRNByInvoiceNoController = async (req, res) => {
  const invoiceNo = req.params.invoiceNo;
  try {
    const grnReq = await getGRNByInvoiceNo(invoiceNo);
    res.status(200).json(grnReq);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// export const getGRNByProduct = async (req, res) => {
//   try {
//     const { productId } = req.query;
//     let grnData;
    
//     if (productId) {
//       // If productId is provided, search for GRN_NO related to that productId
//       grnData = await getGRNByProductId(productId);
     

//     catch (error) {
//     console.error("Error fetching GRN data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



//Function to get GRN by supplierId
export const getGRNBySupplier = async (req, res) => {
  const {supplierId} = req.params;
  console.log("supplier",supplierId);
  try {
    const grnReq = await getGRNBySupplierId(supplierId);
    res.status(200).json(grnReq);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//Function to get GRN by productId
export const getGRNDetailsByProductIdController = async (req, res) => {
  const { productId } = req.params;
  console.log('productId from params:', productId);

  try {
    const grnDetails = await getGRNDetailsByProductId(productId);
    res.status(200).json(grnDetails);
  } catch (error) {
    console.error('Error fetching GRN details by productId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//Function to get GRN by branchId
export const getGRNByBranch = async (req, res) => {
  const {branchId} = req.params;
  console.log("branch",branchId);
  try {
    const grnReq = await getGRNByBranchId(branchId);
    res.status(200).json(grnReq);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Controller function to update a GRN
export const updateGRN = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;
  const updatedStockData = req.body;

  try {
    const updatedStock = await updateGRNById(GRN_NO, updatedStockData);
    res.status(200).json(updatedStock);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Controller function to delete a GRN
export const deleteGRN = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;

  try {
    await deleteGRNById(GRN_NO);
    res.status(204).json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// Controller function to calculate total amount by invoice number
export const getTotalAmountByInvoiceNo = async (req, res) => {
  try {
    // Extract the invoice number from the request parameters
    const { invoiceNo } = req.params;

    // Check if invoice number is provided
    if (!invoiceNo) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    // Call the service function to calculate the total amount
    const totalAmount = await calculateTotalAmount(invoiceNo);

    // Return the total amount in the response
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error("Error calculating total amount by invoice number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// Controller function to retrieve details by invoice number
export const getDetailsByInvoiceNo = async (req, res) => {
  try {
    const { invoiceNo } = req.query;
    console.log("invoive",invoiceNo);

    if (!invoiceNo) {
      throw new Error("Please provide invoiceNo");
    }
    
    // Call the service function to retrieve details by invoice number
    const details = await getDetailsByInvoiceNoService(invoiceNo);
    
    // Respond with the retrieved details
    res.status(200).json(details);
  } catch (error) {
    console.error("Error retrieving details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






// Controller function to get GRNs by criteria
// export const getGRNByCriteria = async (req, res) => {
//   try {
//     const { invoiceNo, productId, productName, supplierId, supplierName } =
//       req.query;
//     const stockDetails = await getGRNDetails({
//       invoiceNo,
//       productId,
//       productName,
//       supplierId,
//       supplierName,
//     });

//     res.status(200).json(stockDetails);
//   } catch (error) {
//     console.error("Error fetching stock details:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };