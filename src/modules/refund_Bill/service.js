import { Op } from 'sequelize';
import RefundBill from './refund_Bill.js';
import BillProduct from '../bill_Product/bill_Product.js';
import Branch from '../branch/branch.js';
import ProductBatchSum from '../productBatchSum/productBatchSum.js';
import { SUCCESS, ERROR } from '../../helper.js';
import { Codes } from './constants.js';

const { SUC_CODES } = Codes;

// Function to generate refund bill number
export const generateRTBNo = async (branchId) => {
    console.log(`Generating refund bill number for branchId: ${branchId}`);
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
        console.error(`Branch not found for branchId: ${branchId}`);
        throw new Error('Branch not found');
    }

    const branchName = branch.branchName;
    const branchPrefix = branchName.substring(0, 3).toUpperCase();
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2);

    const lastRefundBill = await RefundBill.findOne({
        where: {
            branchId,
            RTBNo: {
                [Op.like]: `${branchPrefix}-R${yearSuffix}%`
            }
        },
        order: [['createdAt', 'DESC']],
    });

    let newRefundBillNumber = 1;
    if (lastRefundBill) {
        const lastRefundBillNo = lastRefundBill.RTBNo;
        const lastRefundBillNumber = parseInt(lastRefundBillNo.split('-R')[1].slice(2), 10);
        newRefundBillNumber = lastRefundBillNumber + 1;
    }

    const RTBNo = `${branchPrefix}-R${yearSuffix}${newRefundBillNumber.toString().padStart(6, '0')}`;
    return RTBNo;
};

// Function to process refund
export const processRefund = async (refundData) => {
    const { billNo, branchId, returnedBy, customerName, reason, branchName } = refundData;

    // Generate refund bill number
    const RTBNo = await generateRTBNo(branchId);

    // Create refund bill entry
    const newRefundBill = await RefundBill.create({
        RTBNo,
        billNo,
        branchId,
        branchName,
        returnedBy,
        customerName,
        reason,
        status: 'Refunded', // or any appropriate status
    });

    // Fetch the original bill products
    const billProducts = await BillProduct.findAll({ where: { billNo } });

    for (const billProduct of billProducts) {
        // Adjust product quantities batch-wise
        await ProductBatchSum.increment(
            { availableQty: billProduct.billQty }, // Adjust the quantity
            { where: { batchNo: billProduct.batchNo, productId: billProduct.productId } }
        );
    }

    return newRefundBill;
};

// Function to get refund bill data by RTB number
export const getRefundBillByRTBNo = async (RTBNo) => {
    try {
        const refundBill = await RefundBill.findOne({ where: { RTBNo } });
        if (!refundBill) {
            throw new Error('Refund bill not found');
        }
        return refundBill;
    } catch (error) {
        throw new Error(`Failed to retrieve refund bill: ${error.message}`);
    }
};

// Function to get refund bill products by product ID
export const getRefundBillProductsByProductId = async (productId) => {
    try {
        const refundBillProducts = await BillProduct.findAll({ where: { productId } });
        if (refundBillProducts.length === 0) {
            throw new Error('No refund bill products found for the given product ID');
        }
        return refundBillProducts;
    } catch (error) {
        throw new Error(`Failed to retrieve refund bill products: ${error.message}`);
    }
};
