import { Op } from 'sequelize';
import bill from './bill.js';
import branches from '../branch/branch.js';


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
export const createBill = async ({ branchId, branchName, billedBy, customerName, contactNo, paymentMethod, billTotalAmount,createdAt }) => {
    try {
        // Generate bill number
        const billNo = await generateBillNumber(branchId);

        // Explicitly set status to 'Completed'
        const newBill = await bill.create({
            billNo,
            branchId,
            branchName,
            billedBy,
            customerName,
            contactNo,
            paymentMethod,
            billTotalAmount,
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
        const bills = await bill.findAll();
        if (!bills) {
            throw new Error("No bills found");
        }
        return bills.map(billProduct => ({
            billNo: billProduct.billNo,
            branchId: billProduct.branchId,
            branchName: billProduct.branchName,
            billedBy: billProduct.billedBy,
            customerName: billProduct.customerName,
            contactNo: billProduct.contactNo,
            paymentMethod: billProduct.paymentMethod,
            billTotalAmount: billProduct.billTotalAmount,
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
