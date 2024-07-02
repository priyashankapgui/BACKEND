import * as Service from './service.js';
import * as refundBillProductService from '../refund_Bill_Product/service.js';
import { Codes } from "./constants.js";
import { SUCCESS, ERROR } from "../../helper.js";

const { SUC_CODES } = Codes;

export const createRefundBillController = async (req, res) => {
    try {
        const { billNo, returnedBy, reason, refundTotalAmount, products } = req.body;

        // Create refund bill entry
        const newRefundBill = await Service.createRefundBill({ billNo, returnedBy, reason, refundTotalAmount, createdAt: new Date() });
        const { RTBNo } = newRefundBill;

        // Prepare refund bill products
        const RefundBillProducts = products.map(product => ({
            RTBNo,
            productId: product.productId,
            batchNo: product.batchNo,
            billQty: product.billQty,
            returnQty: product.returnQty,
            sellingPrice: product.sellingPrice,
            discount: product.discount,
        }));

        // Create refund bill products entries
        const result = await refundBillProductService.createRefundBillProduct(RefundBillProducts);

        if (result.success) {
            res.status(201).json({ message: 'Refund Bill and refund_Bill_Product entries created successfully', newRefundBill, newRefundBillProducts: result.newRefundBillProduct });
        } else {
            res.status(400).json({ message: 'Validation error creating refund_Bill_Product entries' });
        }
    } catch (error) {
        console.error('Error creating Refund Bill and refund_Bill_Product entries:', error);
        res.status(500).json({ message: 'Failed to create Refund Bill and refund_Bill_Product entries' });
    }
};


export const getAllRefundBillsController = async (req, res) => {
    try {
        const refundBills = await Service.getAllRefundBills(req.query);
        SUCCESS(res, SUC_CODES, refundBills, req.span);
    } catch (err) {
        console.error('Error fetching all refund bills:', err);
        ERROR(res, err, req.span);
    }
};

export const getRefundBillByRTBNoController = async (req, res) => {
    try {
        const { RTBNo } = req.params;
        const refundBill = await Service.getRefundBillByRTBNo(RTBNo);
        res.status(200).json(refundBill);
    } catch (error) {
        console.error('Failed to retrieve refund bill:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getRefundBillProductsByProductIdController = async (req, res) => {
    try {
        const { productId } = req.params;
        const refundBillProducts = await Service.getRefundBillProductsByProductId(productId);
        res.status(200).json(refundBillProducts);
    } catch (error) {
        console.error('Failed to retrieve refund bill products:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getRefundBillDetailsController = async (req, res) => {
    const { RTBNo } = req.query;

    if (!RTBNo) {
        return ERROR(res, { message: 'RTBNo parameter is missing' }, req.span, 400);
    }

    console.log("refundBill", RTBNo);

    try {
        const result = await refundBillProductService.getRefundBillProductsByRTBNumber(RTBNo);
        console.log("Refund Bill Details", result);
        SUCCESS(res, SUC_CODES, result, req.span);
    } catch (error) {
        console.error('Error fetching Refund Bill details:', error);
        ERROR(res, { message: 'Failed to fetch Refund Bill details', error: error.message }, req.span, 500);
    }
};