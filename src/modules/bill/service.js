import sequelize from '../../../config/database.js';
import bill from '../bill/bill.js';
import branches from '../branch/branch.js';

const generateBillNo = async (branchId) => {
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

    const lastBill = await bill.findOne({
        where: {
            branchId,
            billNo: {
                [sequelize.Op.like]: `${branchPrefix}-B${yearSuffix}%`
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



export const getAllBillData = async () => {
    try {
        const billDataReq = await bill.findAll();
        console.log(billDataReq);
        return billDataReq;
    } catch (error) {
        console.error('Error retrieving bill all data:', error);
        throw new Error('Error retrieving bill all data');
    }
};

export const getbillDataByNoService = async (billNo) => {
    try {
        const billDataByNo = await bill.findByPk(billNo);
        return billDataByNo;
    } catch (error) {
        throw new Error('Error fetching bill data by billNo: ' + error.message);
    }
};

export const addbillDataService = async (billData) => {
    try {
        console.log('billData:', billData);
        const billNo = await generateBillNo(billData.branchId);
        billData.billNo = billNo;
        const newBillData = await bill.create(billData);
        return newBillData;
    } catch (err) {
        console.log("There was an issue adding the bill data to the database", err);
        throw new Error('Failed to add bill data');
    }
};

export const cancellbillDatabyNoService = async (billNo) => {
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
