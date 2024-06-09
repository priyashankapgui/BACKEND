import * as Service from './service.js';
import * as refundBillProductService from '../refund_Bill_Product/service.js';



export const createRefundController = async (req, res) => {
    try {
        const { billNo, branchId, branchName, returnedBy, customerName, status, reason, products } = req.body;

        // Create refund bill entry
        const newRefundBill = await Service.createRefund({ billNo, branchId, branchName, returnedBy, customerName, status, reason });
        const { RTBNo } = newRefundBill;

        // Prepare refund bill products
        const RefundBillProducts = products.map(product => ({
            RTBNo,
            billNo: product.billNo,
            branchId: product.branchId,
            branchName: product.branchName,
            productId: product.productId,
            batchNo: product.batchNo,
            barcode: product.barcode,
            productName: product.productName,
            billQty: product.billQty,
            returnQty: product.returnQty,
            returnPriceAmount: product.returnPriceAmount,
            reason: product.reason,
        }));

        // Create refund bill products entries
        const result = await refundBillProductService.createRefund(RefundBillProducts);

        if (result.success) {
            res.status(201).json({ message: 'Refund Bill and refund_Bill_Product entries created successfully', newRefundBill, newRefundBillProducts: result.newRefundBillProducts });
        } else {
            res.status(400).json({ message: 'Validation error creating refund_Bill_Product entries' });
        }
    } catch (error) {
        console.error('Error creating Refund Bill and refund_Bill_Product entries:', error);
        res.status(500).json({ message: 'Failed to create Refund Bill and refund_Bill_Product entries' });
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
