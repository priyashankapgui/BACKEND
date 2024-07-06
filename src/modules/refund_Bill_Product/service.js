import RefundBillProduct from './refund_Bill_Product.js';
import branches from '../branch/branch.js';
import refund_Bill from '../refund_Bill/refund_Bill.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "./constants.js";
import refund_Bill_Product from './refund_Bill_Product.js';
import Product from '../product/product.js';
import bill_Product from '../bill_Product/bill_Product.js';
import { handleBilling } from '../productBatchSum/service.js';

const { SUC_CODES } = Codes;

export const createRefundBillProduct = async (refundBillProducts) => {
    try {
        if (!Array.isArray(refundBillProducts)) {
            throw new Error('refund bill_Product entries should be an array');
        }

        const newRefundBillProduct = await Promise.all(refundBillProducts.map(entry => RefundBillProduct.create(entry)));
        console.log('refundBillProduct:', newRefundBillProduct);

        return { success: true, newRefundBillProduct };
    } catch (error) {
        console.error('Error creating refundbill_Product:', error.message);
        throw new Error('Error creating refubdbill_Product: ' + error.message);
    }
};

export const getRefundBillProductsByRTBNumber = async (RTBNo) => {
    if (!RTBNo) {
        throw new Error('RTBNo parameter is missing');
    }

    console.log("Fetching refund bill details for:", RTBNo);
    try {
        // Fetch refund bill details
        const refundBillDetails = await refund_Bill.findOne({
            where: { RTBNo },
            raw: true,
        });

        if (!refundBillDetails) {
            throw new Error(`refund Bill not found for RTBNo: ${RTBNo}`);
        }

        console.log("Refund Bill details:", refundBillDetails);

        // Fetch branch details
        const branchDetails = await branches.findOne({
            where: { branchId: refundBillDetails.branchId },
            raw: true,
        });

        if (!branchDetails) {
            throw new Error(`Branch not found for branchId: ${refundBillDetails.branchId}`);
        }

        console.log("Branch details:", branchDetails);

        // Fetch refund bill products
        const refundBillProducts = await refund_Bill_Product.findAll({
            where: { RTBNo },
            attributes: ['productId', 'batchNo', 'billQty', 'returnQty', 'sellingPrice', 'discount'],
            raw: true,
        });

        if (!refundBillProducts || refundBillProducts.length === 0) {
            throw new Error(`No products found for RTBNo: ${RTBNo}`);
        }

        console.log("Refund Bill Products:", refundBillProducts);

        // Fetch refund product details for each refund bill product and include productName
        const refundBillProductsWithDetails = await Promise.all(refundBillProducts.map(async (product) => {
            const productDetails = await Product.findOne({
                where: { productId: product.productId },
                attributes: ['productName'],
                raw: true,
            });

            if (!productDetails) {
                throw new Error(`Product not found for productId: ${product.productId}`);
            }

            return {
                ...product,
                productName: productDetails.productName,
            };
        }));

        const result = {
            RTBNo: refundBillDetails.RTBNo,
            billNo: refundBillDetails.billNo,
            createdAt: refundBillDetails.createdAt,
            branchId: refundBillDetails.branchId,
            branchName: branchDetails.branchName,
            branchAddress: branchDetails.address,
            branchEmail: branchDetails.email,
            branchPhone: branchDetails.contactNumber,
            returnedBy: refundBillDetails.returnedBy,
            customerName: refundBillDetails.customerName,
            contactNo: refundBillDetails.contactNo,
            status: refundBillDetails.status,
            reason: refundBillDetails.reason,
            refundTotalAmount: refundBillDetails.refundTotalAmount,
            refundBillProducts: refundBillProductsWithDetails,
        };

        console.log("Final result:", result);
        return result;
    } catch (error) {
        console.error('Error fetching refund bill details:', error);
        throw new Error('Failed to fetch refund bill details: ' + error.message);
    }
};
