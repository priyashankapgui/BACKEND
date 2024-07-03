//import { updateProductBatchSum, getBatchDetailsByProductName, getAllProductBatchSumData, getProductSumBatchByProductId, getProductSumBatchByBarcode, getBatchSumByBranchId, adjustProductGRNQuantity } from "../productBatchSum/service.js";
import * as ProductBatchSumService from "../productBatchSum/service.js";
import * as Service from '../productBatchUpdateReason/service.js'
import branches from "../branch/branch.js";
import products from "../product/product.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../productBatchSum/constants.js";

const { SUC_CODES } = Codes;



//Function to get all 
export const getAllProductBatchSumController = async (req, res) => {
  try {
    const allData = await ProductBatchSumService.getAllProductBatchSumData();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error retrieving all product batch sum data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller function to retrieve batch details by productName and branchNo for check price 
export const getBatchDetailsByProductNameController = async (req, res) => {
  try {
    const { productId, branchName } = req.query;
    console.log("product", productId);
    console.log("branch", branchName);

    if (!productId || !branchName) {
      throw new Error("Please provide both productId and branchName");
    }

    const result = await ProductBatchSumService.getBatchDetailsByProductName(productId, branchName);

    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};




//Function for adjust the stock quantity
export const adjustProductQuantity = async (req, res) => {
  try {
    const { productName, branchName, batchNo, newQuantity } = req.body;

    await ProductBatchSumService.adjustProductGRNQuantity(productName, branchName, batchNo, newQuantity);

    const result = await products.findOne({ where: { productName } });

    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};


export const handleBillingController = async (req, res) => {
  try {
    const { billedProducts, branchName } = req.body;
    console.log("branchName", branchName);
    await ProductBatchSumService.handleBilling(billedProducts, branchName);

    res.status(200).json({ message: 'Billing processed successfully.' });
  } catch (error) {
    console.error("Error processing billing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleBillCancellationController = async (req, res) => {
  try {
    const { canceledProducts, branchId } = req.body;

    await ProductBatchSumService.handleBillCancellation(canceledProducts, branchId);

    res.status(200).json({ message: 'Bill cancellation processed successfully.' });
  } catch (error) {
    console.error("Error processing bill cancellation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// get details of updated STock and price
export const getProductBatchDetailsController = async (req, res) => {
  const { productId, branchName } = req.query;

  try {
    const result = await Service.getProductBatchDetails(productId, branchName);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};


export const getAllProductsByBranchController = async (req, res) => {
  const { searchTerm, branchName } = req.query;

  try {
    const branch = await branches.findOne({ where: { branchName } });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const products = await ProductBatchSumService.getAllProductsByBranch(searchTerm, branch.branchId);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products data by branch:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductsByBarcodeController = async (req, res) => {
  const { barcode, branchName } = req.query;

  try {
    const branch = await branches.findOne({ where: { branchName } });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const products = await ProductBatchSumService.getProductsByBarcode(barcode, branch.branchId);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products data by barcode:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




//Function to update the discount
export const updateDiscount = async (req, res) => {
  const updates = req.body.updates; // Assuming updates is an array of objects

  try {
    const results = await Promise.all(
      updates.map(async ({ productId, batchNo, branchName, discount }) => {
        if (typeof discount !== 'number') {
          throw new Error('Discount must be a number');
        }

        const result = await ProductBatchSumService.updateProductBatchDiscount(
          productId,
          batchNo,
          branchName,
          discount
        );
        return result;
      })
    );

    SUCCESS(res, SUC_CODES, results, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};



//Function to minQty
export const getProductQuantitiesByBranchController = async (req, res) => {
  try {
    const { branchName } = req.query;

    if (!branchName) {
      return res.status(400).json({ error: 'Branch name is required' });
    }

    const results = await ProductBatchSumService.getProductQuantitiesByBranch(branchName);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found with quantities less than minQty' });
    }
    SUCCESS(res, SUC_CODES, results, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};




//min stock without any parameter
export const getAllProductQuantitiesController = async (req, res) => {
  try {
    const results = await ProductBatchSumService.getAllProductQuantities();

    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found with quantities less than minQty' });
    }

    SUCCESS(res, SUC_CODES, results, req.span);
  } catch (err) {
    console.error('Error in getAllProductQuantitiesController:', err);
    ERROR(res, err, res.span);
  }
};










export const getProductQuantities = async (req, res) => {
  const { branchName, productId } = req.query;

  try {
    let results;

    switch (true) {
      case productId && branchName && branchName !== 'All':
        console.log("case1", branchName);
        console.log("case1", productId);
        results = await ProductBatchSumService.getProductQuantitiesByProductAndBranch(branchName, productId);
        break;

      case branchName && branchName !== 'All':
        console.log("case2", branchName);
        console.log("case2", productId);
        results = await ProductBatchSumService.getProductQuantitiesByBranch(branchName);
        break;

      case productId && !branchName || branchName === 'All':
        console.log("case3", branchName);
        console.log("case3", productId);
        results = await ProductBatchSumService.getProductQuantitiesByProductId(productId);
        break;

      default:
        console.log("case4", branchName);
        console.log("case4", productId);
        results = await ProductBatchSumService.getAllProductQuantities();
        break;
    }

    res.json({ data: results });
  } catch (error) {
    console.error('Error fetching product quantities:', error);
    res.status(500).json({ message: 'Unable to fetch product quantities' });
  }
};

export const getAllProductBatchSumDataByBranchController = async (req, res) => {
  const { branchName } = req.query;

  console.log(`Received request for branch: ${branchName}`);

  try {
    const data = await ProductBatchSumService.getAllProductBatchSumDataByBranch(branchName);
    return res.status(200).json({
      success: true,
      message: `Stock summery Product batch sum data retrieved successfully for branch: ${branchName}`,
      data,
    });
  } catch (error) {
    console.error('Error retrieving Stock summery product batch sum data by branch:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving Stock summery product batch sum data by branch',
      error: error.message,
    });
  }
};



export const getUpcomingExpProductBatchSumDataByBranchController = async (req, res) => {
  const { branchName } = req.query;

  console.log(`Received request for branch: ${branchName}`);

  try {
    const data = await ProductBatchSumService.getUpcomingExpProductBatchSumDataByBranch(branchName);
    return res.status(200).json({
      success: true,
      message: `Upcoming exp Product batch sum data retrieved successfully for branch: ${branchName}`,
      data,
    });
  } catch (error) {
    console.error('Error retrieving Upcoming exp product batch sum data by branch:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving Upcoming exp product batch sum data by branch',
      error: error.message,
    });
  }
}




export const getProductDetailsByBranchNameController = async (req, res) => {
  const { branchName } = req.query;
  console.log("branchName",branchName);

  try {
    const products = await ProductBatchSumService.getProductDetailsByBranchName(branchName);

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for the given branch name' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};