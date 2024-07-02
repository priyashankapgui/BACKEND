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
  const result = await ProductGRNService.getAllGRNDetails(req.query);
  SUCCESS(res, SUC_CODES, result, req.span);
} catch (err) {
  console.log(err);
  ERROR(res, err, res.span);
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












