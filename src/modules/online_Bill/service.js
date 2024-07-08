import sequelize from "../../../config/database.js";
import { Op } from 'sequelize';
import branches from "../branch/branch.js";
import Customer from '../customer/customer.js';
import onlineBill from "./onlineBill.js";
import { mapBranchNameToId } from '../branch/service.js';

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
                [Op.like]: `${branchPrefix}-O${yearSuffix}%`
            }
        },
        order: [['createdAt', 'DESC']],
    });

    let newBillNumber = 1;
    if (lastBill) {
        const lastBillNo = lastBill.onlineBillNo;
        const lastBillNumber = parseInt(lastBillNo.split('-O')[1].slice(2), 10);
        newBillNumber = lastBillNumber + 1;
    }

    const onlineBillNo = `${branchPrefix}-O${yearSuffix}${newBillNumber.toString().padStart(6, '0')}`;
    return onlineBillNo;
};

const createOnlineBill = async (branchId, customerId, acceptedBy, status, hopeToPickup) => {
    try {
        const onlineBillNo = await generateOnlineBillNo(branchId);

        const newBill = await onlineBill.create({
            onlineBillNo,
            branchId,
            customerId,
            acceptedBy,
            status,
            hopeToPickup,
            createdAt: new Date()
        });

        return newBill;
    } catch (error) {
        console.error(`Error creating online bill for branchId ${branchId}, customerId ${customerId}:`, error);
        throw new Error(`Error creating online bill: ${error.message}`);
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
        console.log(`Searching for online bill with number: ${onlineBillNo}`);

        const bill = await onlineBill.findOne({
            where: { onlineBillNo },
            include: [
                { model: branches, as: 'branch' },
                { model: Customer, as: 'customer' }
            ]
        });

        if (!bill) {
            console.error(`Online bill with number ${onlineBillNo} not found`);
            throw new Error('Online bill not found');
        }

        console.log(`Found online bill: ${JSON.stringify(bill, null, 2)}`);
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

const getSumOfOnlineBillTotalAmountForDate = async (branchName, startDate, endDate) => {
    try {
        const branchId = await mapBranchNameToId(branchName);

        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const result = await onlineBill.findOne({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('SUM', sequelize.col('onlineBillTotal')), 'totalAmount']
            ],
            where: {
                branchId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
        });

        if (!result) {
            throw new Error("No data found");
        }

        return result.dataValues.onlineBillTotalAmount || 0; // Return 0 if no bills found
    } catch (error) {
        console.error('Error in getSumOfOnlineBillTotalAmountForDates:', error);
        throw new Error('Error fetching sum of onlineBillTotalAmount for dates: ' + error.message);
    }
};


export const getDailyOnlineSalesDataForMonth = async (branchName, year, month) => {
    try {
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0));
        
        const onlineSalesData = await getSumOfOnlineBillTotalAmountForDate(branchName, startDate, endDate);
        
        const salesData = Array.from({ length: endDate.getUTCDate() }, (_, i) => ({
            day: i + 1,
            totalAmount: 0
        }));

        onlineSalesData.forEach(item => {
            const day = new Date(item.date).getUTCDate();
            salesData[day - 1].totalAmount = item.totalAmount;
        });

        return salesData;
    } catch (error) {
        console.error('Error in getDailyOnlineSalesDataForMonth:', error);
        throw new Error('Error fetching daily online sales data for month: ' + error.message);
    }
};
export {
    generateOnlineBillNo,
    createOnlineBill,
    getAllOnlineBills,
    getOnlineBillByNumber,
    updateOnlineBill,
    getSumOfOnlineBillTotalAmountForDate
};
