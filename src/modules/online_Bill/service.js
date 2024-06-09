import sequelize from "../../../config/database";
import { Op } from 'sequelize';
import branches from "../branch/branch";
import onlineBill from "./onlineBill";
 
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
    return billNo;
};