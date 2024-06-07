import * as Service from './service.js';

export const processRefundController = async (req, res) => {
    try {
        const refundData = req.body;
        const newRefundBill = await Service.processRefund(refundData);
        res.status(201).json(newRefundBill);
    } catch (error) {
        console.error('Failed to process refund:', error);
        res.status(500).json({ error: error.message });
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
