import sequelize from '../../../config/database.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "./constants.js";

const { SUC_CODES } = Codes;

import BillProduct from './bill_Product.js';

export const addBillProduct = async (billProductData) => {
    try {
        const newBillProduct = await BillProduct.create(billProductData);
        // Assuming adjustProductQuantity is a function you have implemented elsewhere
        await adjustProductQuantity(billProductData.productId, billProductData.branchName, billProductData.batchNo, -billProductData.billQty);
        return newBillProduct;
    } catch (error) {
        throw new Error('Failed to add BillProduct');
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

export const getBillProductsByBillNo = async (billNo) => {
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
