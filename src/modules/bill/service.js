import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import bill from './bill.js';
import branches from '../branch/branch.js';
import { mapBranchNameToId } from '../branch/service.js';
import { getSumOfRefundBillTotalAmountForDate } from '../refund_Bill/service.js';

// Generate Bill Number
const generateBillNumber = async (branchId) => {
    const branch = await branches.findByPk(branchId);
    if (!branch) {
        throw new Error('Branch not found');
    }

    const branchName = branch.branchName;
    const branchPrefix = branchName.substring(0, 3).toUpperCase();
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2);

    const lastBill = await bill.findOne({
        where: {
            branchId,
            billNo: {
                [Op.like]: `${branchPrefix}-B${yearSuffix}%`
            }
        },
        order: [['createdAt', 'DESC']],
    });

    let newBillNumber = 1;
    if (lastBill) {
        const lastBillNo = lastBill.billNo;
        const lastBillNumber = parseInt(lastBillNo.split('-B')[1].slice(2), 10);
        newBillNumber = lastBillNumber + 1;
    }

    const billNo = `${branchPrefix}-B${yearSuffix}${newBillNumber.toString().padStart(6, '0')}`;
    return billNo;
};

// Create Bill
export const createBill = async ({ branchName, billedBy, customerName, contactNo, paymentMethod, billTotalAmount, receivedAmount, createdAt }) => {
    try {
        const branchId = await mapBranchNameToId(branchName);
        // Generate bill number
        const billNo = await generateBillNumber(branchId);

        // Explicitly set status to 'Completed'
        const newBill = await bill.create({
            billNo,
            branchId,
            billedBy,
            customerName,
            contactNo,
            paymentMethod,
            billTotalAmount,
            receivedAmount,
            status: 'Completed',
            createdAt,
        });

        return newBill;
    } catch (error) {
        throw new Error('Error creating bill: ' + error.message);
    }
};

// Function to get all bills
export const getAllBills = async () => {
    try {
        // Use a join to include branch names
        const bills = await bill.findAll({
            include: [{
                model: branches,
                attributes: ['branchName', 'address', 'contactNumber', 'email'],
            }],
        });

        if (!bills) {
            throw new Error("No bills found");
        }

        return bills.map(billProduct => ({
            billNo: billProduct.billNo,
            branchId: billProduct.branchId,
            branchName: billProduct.branch.branchName,
            billedBy: billProduct.billedBy,
            customerName: billProduct.customerName,
            contactNo: billProduct.contactNo,
            paymentMethod: billProduct.paymentMethod,
            billTotalAmount: billProduct.billTotalAmount,
            receivedAmount: billProduct.receivedAmount,
            status: billProduct.status,
            createdAt: billProduct.createdAt,
        }));
    } catch (error) {
        throw new Error('Error fetching all bills: ' + error.message);
    }
};

// Get Bill by Number
export const getBillByNumber = async (billNo) => {
    try {
        const billInstance = await bill.findByPk(billNo);
        if (!billInstance) {
            throw new Error('Bill not found');
        }
        return billInstance;
    } catch (error) {
        throw new Error('Error fetching bill by number: ' + error.message);
    }
};

// Cancel Bill by Number
export const cancelBillByNumber = async (billNo) => {
    try {
        const billToCancel = await bill.findByPk(billNo);
        if (!billToCancel) {
            throw new Error('Bill not found');
        }
        billToCancel.status = 'Canceled';
        await billToCancel.save();
        return billToCancel;
    } catch (error) {
        console.error('Error canceling bill:', error);
        throw new Error('Error canceling bill: ' + error.message);
    }
};

// Update Customer Details by Bill Number
export const updateCustomerDetailsByBillNumber = async (billNo, customerData) => {
    try {
        const billToUpdate = await bill.findByPk(billNo);
        if (!billToUpdate) {
            throw new Error('Bill not found');
        }
        billToUpdate.customerName = customerData.customerName;
        billToUpdate.contactNo = customerData.contactNo;
        await billToUpdate.save();
        return billToUpdate;
    } catch (error) {
        console.error('Error updating customer details:', error);
        throw new Error('Error updating customer details: ' + error.message);
    }
};


export const getSumOfBillTotalAmountForDate = async (branchName, date) => {
    try {
        const branchId = await mapBranchNameToId(branchName);

        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const result = await bill.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('billTotalAmount')), 'totalAmount']
            ],
            where: {
                branchId,
                status: { [Op.ne]: 'Canceled' },
                [Op.and]: sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '=', formattedDate)
            }
        });

        if (!result) {
            throw new Error("No data found");
        }

        return result.dataValues.totalAmount || 0; // Return 0 if no bills found
    } catch (error) {
        console.error('Error in getSumOfBillTotalAmountForDate:', error);
        throw new Error('Error fetching sum of billTotalAmount for date: ' + error.message);
    }
};


export const getNetTotalAmountForDate = async (branchName, date) => {
    try {
        const totalAmount = await getSumOfBillTotalAmountForDate(branchName, date);
        const totalRefundAmount = await getSumOfRefundBillTotalAmountForDate(branchName, date);

        const newTotalAmount = totalAmount - totalRefundAmount;

        return {
            totalAmount,
            totalRefundAmount,
            newTotalAmount,
        };
    } catch (error) {
        console.error('Error fetching net total amount for date:', error);
        throw new Error('Error fetching net total amount for date: ' + error.message);
    }
};

//for chart
export const getDailySalesDataForMonth = async (branchName, year, month) => {
    try {
        const branchId = await mapBranchNameToId(branchName);
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0)); // Last day of the month
        const salesData = [];

        for (let day = 1; day <= endDate.getUTCDate(); day++) {
            const date = new Date(Date.UTC(year, month - 1, day));
            const formattedDate = date.toISOString().split('T')[0];
            const { newTotalAmount } = await getNetTotalAmountForDate(branchName, formattedDate);
            salesData.push({ day, totalAmount: newTotalAmount });
        }

        return salesData;
    } catch (error) {
        console.error('Error in getDailySalesDataForMonth:', error);
        throw new Error('Error fetching daily sales data for month: ' + error.message);
    }
};
