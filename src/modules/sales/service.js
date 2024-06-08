import Sales from './sales.js';
import { Op } from 'sequelize';

export const getDailySalesForBranch = async (branchId, startDate, endDate) => {
    try {
        const salesData = await Sales.findAll({
            where: {
                branchId,
                saleDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['saleDate', 'ASC']]
        });
        return salesData;
    } catch (error) {
        throw new Error('Failed to retrieve sales data');
    }
};

export const getAllSalesData = async () => {
    try {
        const salesData = await Sales.findAll();
        return salesData;
    } catch (error) {
        throw new Error('Failed to retrieve all sales data');
    }
};
