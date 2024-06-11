import { Op } from 'sequelize';
import bill from './bill.js';
import branches from '../branch/branch.js';

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

export const createBill = async ({ branchId, billedBy, customerName, contactNo, status }) => {
    try {
        const billNo = await generateBillNumber(branchId);

        const newBill = await bill.create({
            billNo,
            branchId,
            billedBy,
            customerName,
            contactNo,
            status,
        });

        return newBill;
    } catch (error) {
        throw new Error('Error creating bill: ' + error.message);
    }
};

export const getAllBills = async () => {
    try {
        const bills = await bill.findAll();
        return bills;
    } catch (error) {
        console.error('Error retrieving all bills:', error);
        throw new Error('Error retrieving all bills');
    }
};

export const getBillByNumber = async (billNo) => {
    try {
        const bill = await bill.findByPk(billNo);
        return bill;
    } catch (error) {
        throw new Error('Error fetching bill by number: ' + error.message);
    }
};

export const cancelBillByNumber = async (billNo) => {
    try {
        const billToCancel = await bill.findByPk(billNo);
        if (!billToCancel) {
            throw new Error('Bill not found');
        }
        billToCancel.status = 'canceled';
        await billToCancel.save();
        return billToCancel;
    } catch (error) {
        console.error('Error canceling bill:', error);
        throw new Error('Error canceling bill: ' + error.message);
    }
};

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
