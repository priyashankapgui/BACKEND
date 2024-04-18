import { getlistedProducts, getlistedProductByIdService, addlistedProductService, deleteListedProductByIdService } from "../listedProducts/service.js";

export const getAlllistedProducts = async (req, res) => {
    try {
        const listedProductsReq = await getlistedProducts();
        res.status(200).json(listedProductsReq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getlistedProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const listedProduct = await getlistedProductByIdService(productId);
        if (!listedProduct) {
            return res.status(404).json({ error: 'No Product Found' });
        }
        res.status(200).json(listedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addlistedProduct = async (req, res) => {
    const listedProductData = req.body;
    try {
        console.log('Products Details Added', listedProductData);
        const addedListing = await addlistedProductService(listedProductData);
        res.status(201).json(addedListing);
    } catch (error) {
        console.error('Error adding product details', error);
        res.status(500).json({ error: error.message });
    }
};

export const deletelistedProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const deleteResult = await deleteListedProductByIdService(productId);
        res.status(200).json(deleteResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};