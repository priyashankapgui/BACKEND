import {
  addGRN,
  getAllGRNs,
  getGRNById,
  getGRNByInvoiceNo,
  //getGRNDetails,
  updateGRNById,
  deleteGRNById,
  getGRNByProductId,
  getDetailsByInvoiceNoService
  //getTotalAmountByInvoiceNoService
} from "../GRN/service.js";
import * as grnService from '../GRN/service.js';

import { createProductGRNService } from "../../modules/product_GRN/service.js";
import grn from "../../modules/GRN/grn.js";
import { calculateTotalAmount } from '../../modules/product_GRN/service.js';


// Function to create GRN and Product_GRN
export const createGRNAndProduct = async (req, res) => {
  try {
    const { invoiceNo, supplierName, branchName, productId, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, comment } = req.body;

    const grnData = {
      invoiceNo,
      supplierName,
      branchName
    };
    const newGRN = await addGRN(grnData, supplierName, branchName); 
    const GRN_NO = newGRN.GRN_NO; 

    const productGRNData = {
      productId,
      GRN_NO,
      batchNo,
      totalQty,
      purchasePrice,
      sellingPrice,
      freeQty,
      expDate,
      amount: (totalQty - freeQty) * purchasePrice, 
      comment
    };
    const newProductGRN = await createProductGRNService(productGRNData); 
    
    res.status(201).json({
      GRN: newGRN,
      Product_GRN: newProductGRN
    });
  } catch (error) {
    console.error("Error creating GRN and Product_GRN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all GRNs
export const getGRNs = async (req, res) => {
  try {
    const grnAll = await getAllGRNs();
    res.status(200).json(grnAll);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get a GRN by its GRN_NO
export const getGRN = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;

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

export const getGRNByProduct = async (req, res) => {
  try {
    const { productId, productName } = req.query;
    let grnData;
    
    if (productId) {
      // If productId is provided, search for GRN_NO related to that productId
      grnData = await getGRNByProductId(productId);
    } else if (productName) {
      // If productName is provided, first find the corresponding productId
      const productId = await getProductIdByName(productName);
      if (productId) {
        // If productId is found, search for GRN_NO related to that productId
        grnData = await getGRNByProductId(productId);
      } else {
        throw new Error("Product not found");
      }
    } else {
      throw new Error("Please provide either productId or productName");
    }

    res.status(200).json(grnData);
  } catch (error) {
    console.error("Error fetching GRN data:", error);
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
