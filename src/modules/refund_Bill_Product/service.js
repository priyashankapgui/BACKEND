import RefundBillProduct from './refund_Bill_Product.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "./constants.js";

const { SUC_CODES } = Codes;

// Function to add a product to a refund bill
export const addProductToRefundBill = async (data) => {
    try {
        const refundBillProduct = await RefundBillProduct.create(data);
        return refundBillProduct;
    } catch (error) {
        throw new Error(`Failed to add product to refund bill: ${error.message}`);
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
