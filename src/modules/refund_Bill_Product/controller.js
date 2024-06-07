import * as Service from './service.js';

export const addProductToRefundBillController = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await Service.addProductToRefundBill(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Failed to add product to refund bill:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getRefundBillProductsByRTBNoController = async (req, res) => {
    try {
        const { RTBNo } = req.params;
        const refundBillProducts = await Service.getRefundBillProductsByRTBNo(RTBNo);
        res.status(200).json(refundBillProducts);
    } catch (error) {
        console.error('Failed to retrieve refund bill products:', error);
        res.status(500).json({ error: error.message });
    }
};
