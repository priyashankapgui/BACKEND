import {
  addGRN,
  getAllGRNs,
  getGRNById,
  getGRNByInvoiceNo,
  updateGRNById,
  deleteGRNById,
  getGRNBySupplierId,
  getGRNByBranchId,
  getGRNsByBranchAndSupplier,
  //getGRNsByBranchNameService
} from "../GRN/service.js";
import * as GRNService from "../GRN/service.js"
import { createProductGRNService, getGRNDetailsByProductId } from "../../modules/product_GRN/service.js";
import { calculateTotalAmount } from '../../modules/product_GRN/service.js'; 
import { updateProductQty } from "../productBatchSum/service.js";
import suppliers from "../supplier/supplier.js";
import branches from "../branch/branch.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../GRN/constants.js";

const { SUC_CODES } = Codes;




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
      barcode: product.barcode,
      comment: product.comment,
    }));

    

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



//Function to get GRN data using branchName and supplierId
export const getGRNsByBranchAndSupplierController = async (req, res) => {
  try {
    // const branchName = req.params.branchName;
    // const supplierId = req.params.supplierId;
    const {branchName , supplierId } = req.query;
    //const { branchName, supplierId } = req.body; // Assuming you are sending branchName and supplierId in the request body

    if (!branchName || !supplierId) {
      return res.status(400).json({ message: ' branchName and supplierId are required' });
    }

    const grnData = await getGRNsByBranchAndSupplier(branchName, supplierId);

    res.status(200).json(grnData);
  } catch (error) {
    console.error('Error fetching GRNs by branch and supplier:', error);
    res.status(500).json({ message: 'Failed to fetch GRNs by branch and supplier' });
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



























//function to get grn data using branchName ans productId
// export const getGRNsAndProductGRNDataByBranchNameAndProductIdController = async (req, res) => {
//   try {
//     const { branchName, productId } = req.query;

//     if (!branchName || !productId) {
//       return res.status(400).json({ message: 'branchName and productId are required' });
//     }

//     // Get GRNs for the branchName
//     const grnItems = await getGRNsByBranchNameService(branchName);

//     // Extract GRN_NOs from the results
//     const grnNos = grnItems.map(grnItem => grnItem.gen.GRN_NO);

//     // Get productGRN details for each GRN_NO and productId
//     const productGRNData = await getProductGRNDataByProductIdAndGRNNOService(productId, grnNos);

//     // Map and format the data as needed
//     const formattedData = grnItems.map(grnItem => ({
//       GRN_NO: grnItem.gen.GRN_NO,
//       createdAt: grnItem.gen.createdAt,
//       branchName: grnItem.gen.branch.branchName,
//       supplierName: grnItem.gen.supplier.supplierName,
//       invoiceNo: grnItem.gen.invoiceNo,
//       productGRNData: productGRNData.filter(item => item.GRN_NO === grnItem.gen.GRN_NO),
//     }));

//     res.status(200).json(formattedData);
//   } catch (error) {
//     console.error('Error fetching GRN and productGRN data:', error);
//     res.status(500).json({ message: 'Failed to fetch GRN and productGRN data' });
//   }
// };






// // Controller function to retrieve details by invoice number
// export const getDetailsByInvoiceNo = async (req, res) => {
//   try {
//     const { invoiceNo } = req.query;
//     console.log("invoive",invoiceNo);

//     if (!invoiceNo) {
//       throw new Error("Please provide invoiceNo");
//     }
    
//     // Call the service function to retrieve details by invoice number
//     const details = await getDetailsByInvoiceNoService(invoiceNo);
    
//     // Respond with the retrieved details
//     res.status(200).json(details);
//   } catch (error) {
//     console.error("Error retrieving details:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };






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