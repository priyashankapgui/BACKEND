import * as Service from './service.js';

export const addBillProductController = async (req, res) => {
    try {
        const billProductData = req.body;
        const newBillProduct = await Service.addBillProduct(billProductData);
        res.status(201).json(newBillProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add BillProduct' });
    }
};

export const getAllBillProductsController = async (req, res) => {
    try {
        const billProducts = await Service.getAllBillProducts();
        res.status(200).json(billProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve BillProducts' });
    }
};

export const getBillProductsByBillNoController = async (req, res) => {
    try {
        const { billNo } = req.params;
        const billProducts = await Service.getBillProductsByBillNo(billNo);
        res.status(200).json(billProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve BillProducts by bill number' });
    }
};

export const getBillProductsByProductIdController = async (req, res) => {
    try {
        const { productId } = req.params;
        const billProducts = await Service.getBillProductsByProductId(productId);
        res.status(200).json(billProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve BillProducts by product ID' });
    }
};
