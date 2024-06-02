import { addBillProduct, getAllBillProducts, getBillProductsByBillNo, getBillProductsByProductId, updateBillProduct, deleteBillProduct } from './service.js';

export const addBillProductController = async (req, res) => {
    try {
        const billProductData = req.body;
        const newBillProduct = await addBillProduct(billProductData);
        res.status(201).json(newBillProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add BillProduct' });
    }
};

export const getAllBillProductsController = async (req, res) => {
    try {
        const billProducts = await getAllBillProducts();
        res.status(200).json(billProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve BillProducts' });
    }
};

export const getBillProductsByBillNoController = async (req, res) => {
    try {
        const { billNo } = req.params;
        const billProducts = await getBillProductsByBillNo(billNo);
        res.status(200).json(billProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve BillProducts by bill number' });
    }
};

export const getBillProductsByProductIdController = async (req, res) => {
    try {
        const { productId } = req.params;
        const billProducts = await getBillProductsByProductId(productId);
        res.status(200).json(billProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve BillProducts by product ID' });
    }
};

export const updateBillProductController = async (req, res) => {
    try {
        const { billNo, productId } = req.params;
        const updateData = req.body;
        const updatedBillProduct = await updateBillProduct(billNo, productId, updateData);
        res.status(200).json(updatedBillProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update BillProduct' });
    }
};

export const deleteBillProductController = async (req, res) => {
    try {
        const { billNo, productId } = req.params;
        const message = await deleteBillProduct(billNo, productId);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete BillProduct' });
    }
};
