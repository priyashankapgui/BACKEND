import * as Service from "../stockTransfer/service.js";
import * as TransferProductBatchService from "../TransferProductBatch/service.js";
import * as ProductBatchSumService from "../productBatchSum/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../productBatchSum/constants.js";

const { SUC_CODES } = Codes;

//Function to create stock transfer IN
export const submitStockTransferAndProductBatch = async (req, res) => {
  try {
    const { STN_NO, submittedBy, supplyingBranch, products } = req.body;
    const productBatchEntries = products.map((product) => ({
      STN_NO,
      supplyingBranch,
      productId: product.productId,
      batchNo: product.batchNo,
      transferQty: product.transferQty,
      unitPrice: product.unitPrice,
      amount: product.amount,
    }));
    const productBatchResult =
      await TransferProductBatchService.createStockTransferProductBatchService(
        productBatchEntries
      );
    const result = await Service.updateStockTransferSubmitted(
      STN_NO,
      submittedBy
    );
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};

//Function to update totalAvailableQty when saving the stock Transfer OUT
export const updateOrAddProductBatchSumController = async (req, res) => {
  try {
    const { STN_NO, requestBranch, products } = req.body;
    if (!STN_NO || !requestBranch || !products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "STN_NO, requestBranch, and products are required" });
    }
    const result = await ProductBatchSumService.updateOrAddProductBatchSum(
      requestBranch,
      products
    );
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (err) {
    console.log(err);
    ERROR(res, err, res.span);
  }
};
