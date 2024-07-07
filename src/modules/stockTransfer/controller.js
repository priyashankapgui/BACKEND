import * as Service from "../stockTransfer/service.js";
import * as TransferProductService from "../TransferProduct/service.js";
import * as ProductBatchSumService from "../productBatchSum/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../productBatchSum/constants.js";

const { SUC_CODES } = Codes;

//Function to create Stock transfer OUT
export const createStockTransferAndProduct = async (req, res) => {
  try {
    const { requestedBy, requestBranch, supplyingBranch, products } = req.body;
    const stockTransferData = await Service.addStockTransfer(
      requestedBy,
      requestBranch,
      supplyingBranch
    );
    const { STN_NO } = stockTransferData;
    const stockTransferProducts = products.map((product) => ({
      STN_NO,
      productId: product.productId,
      requestedQty: product.requestedQty,
      comment: product.comment,
    }));

    const result =
      await TransferProductService.createStockTransferProductService(
        stockTransferProducts
      );
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};

//Function to get all transfers
export const getAllStockTransfersController = async (req, res) => {
  try {
    const result = await Service.getAllStockTransfers();
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};

//Function to cancel stock request IN
export const cancelStockTransferBySTN_NO = async (req, res) => {
  try {
    const { STN_NO, submittedBy } = req.body;
    if (!STN_NO || !submittedBy) {
      return res
        .status(400)
        .json({ message: "STN_NO and submittedBy are required" });
    }
    const result = await Service.cancelStockTransfer(STN_NO, submittedBy);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};

//Function to get the batchNo
export const fetchBatchNumbers = async (req, res) => {
  const { branchName, productId } = req.query;
  try {
    const result =
      await ProductBatchSumService.getBatchNumbersByBranchAndProduct(
        branchName,
        productId
      );
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.error("Error fetching stock transfers by productId:", error);
    ERROR(res, error, req.span);
  }
};

//Function to get details on STN_NO
export const getAllStockTransferDetails = async (req, res) => {
  try {
    const { STN_NO } = req.query;
    if (!STN_NO) {
      return res.status(400).json({ message: "STN_NO is required" });
    }
    const result = await Service.getAllStockTransferDetailsBySTN_NO(STN_NO);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.error("Error fetching stock transfers by productId:", error);
    ERROR(res, error, req.span);
  }
};
