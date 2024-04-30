// import { getAllStocks, getStockById, addStock , deleteStockById, updateStockById } from '../stock/service.js';


import {
  addGRN,
  getAllGRNs,
  getGRNById,
  getGRNByInvoiceNo,
  getGRNDetails,
  updateGRNById,
  deleteGRNById,
  getTotalAmountByInvoiceNoService
} from "../GRN/service.js";
import * as grnService from '../GRN/service.js';
import { mapSupplierNameToId } from "../../modules/supplier/service.js"; 
import { mapBranchNameToId } from "../../modules/branch/service.js"
import { createProductGRNService } from "../../modules/product_GRN/service.js";

// Controller function to create a new GRN
// export const createGRN = async (req, res) => {
//   const {
//     GRN_NO,
//     invoiceNo,
//     supplierName,
//     branchName,
//   } = req.body;

//   const supplierId = await mapSupplierNameToId(supplierName);
//   if (!supplierId) {
//     return res.status(404).json({ error: "Supplier not found" });
//   }

//   const branchId = await mapBranchNameToId(branchName);
//   if (!branchId) {
//     return res.status(404).json({ error: "Supplier not found" });
//   }

//   try {
//     const newgrn = await addGRN({
//       GRN_NO,
//       invoiceNo,
//       supplierId,
//       branchId,
//     });
//     res.status(201).json(newgrn);
//   } catch (error) {
//     console.error("Error adding stock:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// Controller function to get all GRNs
export const getGRNs = async (req, res) => {
  try {
    const stocksAll = await getAllGRNs();
    res.status(200).json(stocksAll);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get a GRN by its GRN_NO
export const getGRN = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;

  try {
    const stock = await getGRNById(GRN_NO);
    if (!stock) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to get GRNs by invoice number
export const getGRNByInvoiceNoController = async (req, res) => {
  const invoiceNo = req.params.invoiceNo;
  try {
    const stockReq = await getGRNByInvoiceNo(invoiceNo);
    res.status(200).json(stockReq);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to get GRNs by criteria
export const getGRNByCriteria = async (req, res) => {
  try {
    const { invoiceNo, productId, productName, supplierId, supplierName } =
      req.query;
    const stockDetails = await getGRNDetails({
      invoiceNo,
      productId,
      productName,
      supplierId,
      supplierName,
    });

    res.status(200).json(stockDetails);
  } catch (error) {
    console.error("Error fetching stock details:", error);
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


export const getTotalAmountByInvoiceNo = async (req, res) => {
  const { invoiceNo } = req.params;
  try {
    if (!invoiceNo) {
      res.status(400).json({ error: "Invoice number is required" });
      return;
    }
    const totalAmount = await grnService.getTotalAmountByInvoiceNoService(invoiceNo);
    if (!totalAmount) {
      res.status(404).json({ error: "No record found for the given invoice number" });
      return;
    }
    res.status(200).json(totalAmount);
  } catch (error) {
    console.error("Error fetching total amount by invoiceNo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// grnController.js

// Import necessary functions and models
//import { addGRN } from './grnService'; // Assuming you have these functions defined
 // Assuming you have this function defined

// Define the combined controller function
export const createGRNAndProduct = async (req, res) => {
  try {
    // Parse incoming data from the request body
    const {  GRN_NO, invoiceNo, supplierName, branchName, productId, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, comment } = req.body;

    const amount = (totalQty - freeQty) * purchasePrice;

    const supplierId = await mapSupplierNameToId(supplierName);
      if (!supplierId) {
        return res.status(404).json({ error: "Supplier not found" });
      }
    
      const branchId = await mapBranchNameToId(branchName);
      if (!branchId) {
        return res.status(404).json({ error: "Supplier not found" });
      }

    // Create GRN
    const grnData = {
      GRN_NO,
      invoiceNo,
      supplierId,
      branchId
    };
   
    console.log('Creating GRN:', grnData);

    const newGRN = await addGRN(grnData);
    console.log('Created GRN:', newGRN);
    //const GRN_No = newGRN.GRN_NO; // Assuming the created GRN object has an 'id' property

    // Create Product_GRN
    const productGRNData = {
      productId,
      GRN_NO,
      batchNo, 
      totalQty,
      purchasePrice,
      sellingPrice,
      freeQty,
      expDate,
      amount,
      comment,
       // Pass the GRN ID to associate the Product_GRN with the created GRN
    };
    console.log('Creating Product_GRN:', productGRNData);
    const newProductGRN = await createProductGRNService(productGRNData); // Assuming createProductGRNService function handles the creation of Product_GRN
    console.log('Created Product_GRN:', newProductGRN);

    // Return response
    res.status(201).json({
      GRN: newGRN,
      Product_GRN: newProductGRN
    });
  } catch (error) {
    console.error("Error creating GRN and Product_GRN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
 