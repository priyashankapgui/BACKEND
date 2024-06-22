import * as SalesService from './service.js';

export const getDailySalesForBranch = async (req, res) => {
    try {
        const { branchId, startDate, endDate } = req.query;
        const salesData = await SalesService.getDailySalesForBranch(branchId, startDate, endDate);
        res.status(200).json(salesData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllSalesData = async (req, res) => {
    try {
        const salesData = await SalesService.getAllSalesData();
        res.status(200).json(salesData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
