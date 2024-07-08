import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import Bill from '../bill/bill.js';
import RefundBill from './refund_Bill.js';
import BillProduct from '../bill_Product/bill_Product.js';
import branches from '../branch/branch.js';
import ProductBatchSum from '../productBatchSum/productBatchSum.js';
import { mapBranchNameToId } from '../branch/service.js';
import { SUCCESS, ERROR } from '../../helper.js';
import { Codes } from './constants.js';

const { SUC_CODES } = Codes;

// Function to generate refund bill number
export const generateRTBNo = async (branchId) => {
    console.log(`Generating refund bill number for branchId: ${branchId}`);
    const branch = await branches.findByPk(branchId);
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
export const createRefundBill = async ({ billNo, returnedBy, reason, refundTotalAmount, createdAt }) => {
    try {
        const billData = await Bill.findOne({ where: { billNo } });
        if (!billData) {
            throw new Error('Bill not found');
        }

        const { branchId, customerName, contactNo } = billData;

        // Generate refund bill number
        const RTBNo = await generateRTBNo(branchId);

        // Create refund bill entry
        const newRefundBill = await RefundBill.create({
            RTBNo,
            billNo,
            branchId,
            returnedBy,
            customerName,
            contactNo,
            refundTotalAmount,
            reason,
            status: 'Refunded',
            createdAt,
        });
        return newRefundBill;
    } catch (error) {
        throw new Error('Error creating refund bill: ' + error.message);
    }
};

// Function to get all refund-bills
export const getAllRefundBills = async () => {
    try {
        // Use a join to include branch names
        const refundBills = await RefundBill.findAll({
            include: [{
                model: branches,
                attributes: ['branchName', 'address', 'contactNumber', 'email'],
            }],
        });

        if (!refundBills) {
            throw new Error("No refundBills found");
        }

        return refundBills.map(refundBillProduct => ({
            RTBNo: refundBillProduct.RTBNo,
            billNo: refundBillProduct.billNo,
            branchId: refundBillProduct.branchId,
            branchName: refundBillProduct.branch.branchName,
            address: refundBillProduct.branch.address,
            returnedBy: refundBillProduct.returnedBy,
            customerName: refundBillProduct.customerName,
            contactNo: refundBillProduct.contactNo,
            reason: refundBillProduct.reason,
            refundTotalAmount: refundBillProduct.refundTotalAmount,
            status: refundBillProduct.status,
            createdAt: refundBillProduct.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching refund bills:', error.message);
        throw new Error('Failed to fetch refund bills');
    }
};

// // Function to get refund bill by RTBNo
// export const getRefundBillByRTBNo = async (RTBNo) => {
//     try {
//         const refundBill = await RefundBill.findByPk(RTBNo);
//         if (!refundBill) {
//             throw new Error('Refund bill not found');
//         }
//         return refundBill;
//     } catch (error) {
//         throw new Error('Error fetching refund bill by RTBNo: ' + error.message);
//     }
// };

// Function to get refund bill products by productId
export const getRefundBillProductsByProductId = async (productId) => {
    try {
        const refundBillProducts = await BillProduct.findAll({
            where: { productId },
        });
        if (!refundBillProducts.length) {
            throw new Error('No refund bill products found for this productId');
        }
        return refundBillProducts;
    } catch (error) {
        throw new Error('Error fetching refund bill products by productId: ' + error.message);
    }
};


export const getSumOfRefundBillTotalAmountForDate = async (branchName, date) => {
    try {
        const branchId = await mapBranchNameToId(branchName);

        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const result = await RefundBill.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('refundTotalAmount')), 'totalRefundAmount']
            ],
            where: {
                branchId,
                [Op.and]: sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '=', formattedDate)
            }
        });

        if (!result) {
            throw new Error("No data found");
        }

        return result.dataValues.totalRefundAmount || 0; // Return 0 if no bills found
    } catch (error) {
        console.error('Error in getSumOfRefundBillTotalAmountForDate:', error);
        throw new Error('Error fetching sum of refundBillTotalAmount for date: ' + error.message);
    }
};

export const getRefundBillsByBranchAndDateRange = async (branchName, startDate, endDate) => {
    try {
        console.log(`Fetching refund bills for branch: ${branchName}, from: ${startDate}, to: ${endDate}`);

        const branchId = await mapBranchNameToId(branchName);
        if (!branchId) {
            throw new Error('Branch not found');
        }

        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

        const refundBills = await RefundBill.findAll({
            where: {
                branchId,
                createdAt: {
                    [Op.between]: [formattedStartDate, formattedEndDate]
                }
            },
            include: [{
                model: branches,
                attributes: ['branchName', 'address', 'contactNumber', 'email'],
            }],
        });

        if (!refundBills.length) {
            throw new Error("No refund bills found for the selected branch and date range");
        }

        return refundBills.map(refundBill => ({
            RTBNo: refundBill.RTBNo,
            billNo: refundBill.billNo,
            branchId: refundBill.branchId,
            branchName: refundBill.branch.branchName,
            address: refundBill.branch.address,
            returnedBy: refundBill.returnedBy,
            customerName: refundBill.customerName,
            contactNo: refundBill.contactNo,
            reason: refundBill.reason,
            refundTotalAmount: refundBill.refundTotalAmount,
            status: refundBill.status,
            createdAt: refundBill.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching refund bills by branch and date range:', error.message);
        throw new Error('Failed to fetch refund bills by branch and date range');
    }
};