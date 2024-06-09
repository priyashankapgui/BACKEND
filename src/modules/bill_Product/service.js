import sequelize from '../../../config/database.js';
import BillProduct from './bill_Product.js';
import { Codes } from "./constants.js";

const { SUC_CODES } = Codes;

export const createBillProducts = async (billProducts) => {
    try {
        if (!Array.isArray(billProducts)) {
            throw new Error('bill_Product entries should be an array');
        }

        const newBillProducts = [];

        for (const entry of billProducts) {
            try {
                const result = await BillProduct.create(entry);
                newBillProducts.push(result);
            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    console.error('Validation error for entry:', entry, error.errors);
                    throw error;
                } else {
                    console.error('Error creating entry:', entry, error);
                    throw error;
                }
            }
        }

        return { success: true, newBillProducts };
    } catch (error) {
        console.error('Error creating bill_Product:', error.message);
        throw new Error('Error creating bill_Product: ' + error.message);
    }
};

export const getAllBillProducts = async () => {
    try {
        const billProducts = await BillProduct.findAll();
        return billProducts;
    } catch (error) {
        throw new Error('Failed to retrieve BillProducts');
    }
};

export const getBillProductsByBillNumber = async (billNo) => {
    try {
        const billProducts = await BillProduct.findAll({ where: { billNo } });
        return billProducts;
    } catch (error) {
        throw new Error('Failed to retrieve BillProducts by bill number');
    }
};

export const getBillProductsByProductId = async (productId) => {
    try {
        const billProducts = await BillProduct.findAll({ where: { productId } });
        return billProducts;
    } catch (error) {
        throw new Error('Failed to retrieve BillProducts by product ID');
    }
};
