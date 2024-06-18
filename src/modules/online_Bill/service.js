import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import branches from "../branch/branch.js";
import Customer from '../customer/customer.js';
import onlineBill from "./onlineBill.js";

const generateOnlineBillNo = async (branchId) => {
    console.log(`Generating bill number for branchId: ${branchId}`);

    const branch = await branches.findByPk(branchId);
    if (!branch) {
        console.error(`Branch not found for branchId: ${branchId}`);
        throw new Error('Branch not found');
    }

    const branchName = branch.branchName;
    const branchPrefix = branchName.substring(0, 3).toUpperCase();
    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2);
    const lastBill = await onlineBill.findOne({
        where: {
            branchId,
            onlineBillNo: {
                [Op.like]: `${branchPrefix}-B${yearSuffix}%`
            }
        },
        order: [['createdAt', 'DESC']],
    });

    let newBillNumber = 1;
    if (lastBill) {
        const lastBillNo = lastBill.onlineBillNo;
        const lastBillNumber = parseInt(lastBillNo.split('-B')[1].slice(2), 10);
        newBillNumber = lastBillNumber + 1;
    }

    const onlineBillNo = `${branchPrefix}-B${yearSuffix}${newBillNumber.toString().padStart(6, '0')}`;
    return onlineBillNo;
};

const createOnlineBill = async (branchId, customerId, acceptedBy, status) => {
    try {
        const onlineBillNo = await generateOnlineBillNo(branchId);

        const newBill = await onlineBill.create({
            onlineBillNo,
            branchId,
            customerId,
            acceptedBy,
            status,
            createdAt: new Date()
        });

        return newBill;
    } catch (error) {
        console.error('Error creating online bill:', error);
        throw error;
    }
};

const getAllOnlineBills = async (filters = {}) => {
    try {
        const bills = await onlineBill.findAll({
            where: filters,
            include: [
                { model: branches, as: 'branch' },
                { model: Customer, as: 'customer' }
            ],
            order: [['createdAt', 'DESC']]
        });
        return bills;
    } catch (error) {
        console.error('Error fetching online bills:', error);
        throw error;
    }
};

const getOnlineBillByNumber = async (onlineBillNo) => {
    try {
        const bill = await onlineBill.findOne({
            where: { onlineBillNo },
            include: [
                { model: branches, as: 'branch' },
                { model: Customer, as: 'customer' }
            ]
        });

        if (!bill) {
            throw new Error('Online bill not found');
        }

        return bill;
    } catch (error) {
        console.error('Error fetching online bill:', error);
        throw error;
    }
};

const updateOnlineBill = async (onlineBillNo, updates) => {
    try {
        const bill = await onlineBill.findOne({
            where: { onlineBillNo }
        });

        if (!bill) {
            throw new Error('Online bill not found');
        }

        await bill.update(updates);

        return bill;
    } catch (error) {
        console.error('Error updating online bill:', error);
        throw error;
    }
};

export {
    generateOnlineBillNo,
    createOnlineBill,
    getAllOnlineBills,
    getOnlineBillByNumber,
    updateOnlineBill
};
