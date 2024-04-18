import sequelize from '../../../config/database.js';
import ListedProducts from '../listedProducts/listedProducts.js';

export const getlistedProducts = async () => {
    try {
        const productsReq = await ListedProducts.findAll();
        console.log(productsReq);
        return productsReq;
    } catch (error) {
        console.error('Error retrieving products:', error);
        throw new Error('Error retrieving products');
    }
};

export const getlistedProductByIdService = async (productId) => {
    try {
        const productbyId = await ListedProducts.findByPk(productId);
        return productbyId;
    } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
    }
};


export const addlistedProductService = async (listedProductData) => {
    try {
        const newListedProduct = await ListedProducts.create(listedProductData);
        return newListedProduct;
    }
    catch (err) {
        console.log("There was an issue adding the listed product to the database", err);
        throw new Error('Failed to add listed product');
    }
};


export const deleteListedProductByIdService = async (productId) => {
    try {
        const product = await ListedProducts.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.destroy();
        return { message: 'Product deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};