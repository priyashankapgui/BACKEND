import * as GRNService from "../GRN/service.js"
import * as ProductGRNService from "../product_GRN/service.js"
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../GRN/constants.js";


const { SUC_CODES } = Codes;




//Function to create GRN 
export const createGRNAndProduct = async (req, res) => {
  try {
    const { invoiceNo, supplierId, branchName, products } = req.body;
    console.log("supplierId",supplierId);

    const grndata = await GRNService.addGRN(invoiceNo, supplierId, branchName);

    const { GRN_NO } = grndata;

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


    const result = await ProductGRNService.createProductGRNService(productGRNs);

    if (result.success) {

      const productIds = [...new Set(productGRNs.map(product => product.productId))];
      //await updateProductQty(productIds);

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
  const result = await GRNService.getAllGRNs(req.query);
  SUCCESS(res, SUC_CODES, result, req.span);
} catch (err) {
  console.log(err);
  ERROR(res, err, res.span);
}
};




// Controller function to get a GRN by its GRN_NO
export const getGRN = async (req, res) => {

try {
  const result = await GRNService.getGRNById(req.params.GRN_NO);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};




// Controller function to get GRNs by invoice number
export const getGRNByInvoiceNoController = async (req, res) => {
try {
  const result = await GRNService.getGRNByInvoiceNo(req.params.invoiceNo);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};



// Function to get GRNs in date range
export const getGRNsByDateRangeController = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }

  // Validate date format
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    const result = await GRNService.getGRNsByDateRange(start, end);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.error('Error fetching GRNs by date range:', error);
    ERROR(res, error, req.span);
  }
};




//Function to get GRN by supplierId
export const getGRNBySupplier = async (req, res) => {
  const {supplierId} = req.params;
  console.log("supplier",supplierId);
  try {
    const result = await GRNService.getGRNBySupplierId(supplierId);

SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};



//Function to get GRN by productId
export const getGRNDetailsByProductIdController = async (req, res) => {
  const { productId } = req.params;
  console.log('productId from params:', productId);

  try {
    const result = await ProductGRNService.getGRNDetailsByProductId(productId);

SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};




//Function to get GRN by branchId
export const getGRNByBranch = async (req, res) => {
  const {branchName} = req.query;
  console.log("branch",branchName);
  try {
    const result = await GRNService.getGRNByBranchId(branchName);
SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) { 
  console.log(error);

  ERROR(res, error, res.span);
}
};



//Function to get GRN data using branchName and supplierId
export const getGRNsByBranchAndSupplierController = async (req, res) => {
  try {
    
    const {branchName , supplierId } = req.query;

    if (!branchName || !supplierId) {
      return res.status(400).json({ message: ' branchName and supplierId are required' });
    }

    const result = await GRNService.getGRNsByBranchAndSupplier(branchName, supplierId);

SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};


// Function to get GRN data using branchName and productId
export const getGRNsByBranchAndProductController = async (req, res) => {
  try {
    const { branchName, productId } = req.query;

    if (!branchName || !productId) {
      return res.status(400).json({ message: 'branchName and productId are required' });
    }

    const result = await GRNService.getGRNsByBranchAndProduct(branchName, productId);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.log(error);
  
    ERROR(res, error, res.span);
  }
  };





// Controller function to calculate total amount by invoice number
export const getTotalAmountByInvoiceNo = async (req, res) => {
  try {
    const { invoiceNo } = req.params;

    if (!invoiceNo) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    const result = await ProductGRNService.calculateTotalAmount(invoiceNo);

SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};


//Function to get all details of a grn using GRN_NO
export const getGRNDetailsController = async (req, res) => {
  const { GRN_NO } = req.query;
  console.log("grn",GRN_NO);

  try {
    const result = await ProductGRNService.getGRNDetailsByNo(GRN_NO);
    console.log("hanee",result);

    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.log(error);
  
    ERROR(res, error, res.span);
  }
  };












