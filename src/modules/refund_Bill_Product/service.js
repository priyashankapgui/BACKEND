import RefundBillProduct from './refund_Bill_Product.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "./constants.js";

const { SUC_CODES } = Codes;

export const cretaeRefundBillProduct = async (refundBillProducts) => {
    try {
        if (!Array.isArray(refundBillProducts)) {
            throw new Error('bill_Product entries should be an array');
        }

        const newrefundBillProduct = [];

        for (const entry of refundBillProducts) {
            try {
                const result = await RefundBillProduct.create(entry);
                newrefundBillProduct.push(result);
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

        return { success: true, newrefundBillProduct };
    } catch (error) {
        console.error('Error creating bill_Product:', error.message);
        throw new Error('Error creating bill_Product: ' + error.message);
    }
};


// Function to get refund bill products by RTB number
export const getRefundBillProductsByRTBNo = async (RTBNo) => {
    try {
        const refundBillProducts = await RefundBillProduct.findAll({ where: { RTBNo } });
        if (refundBillProducts.length === 0) {
            throw new Error('No refund bill products found for the given RTB number');
        }
        return refundBillProducts;
    } catch (error) {
        throw new Error(`Failed to retrieve refund bill products: ${error.message}`);
    }
};
