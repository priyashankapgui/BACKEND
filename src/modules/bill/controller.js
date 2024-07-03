import * as Service from './service.js';
import * as BillProductService from '../bill_Product/service.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "./constants.js";
import { handleBilling } from '../productBatchSum/service.js';
import * as ProductBatchSum from "../productBatchSum/service.js"

const { SUC_CODES } = Codes;

export const createBillController = async (req, res) => {
    try {
        const { branchName, billedBy, customerName, contactNo, status, paymentMethod, billTotalAmount, receivedAmount, products } = req.body;

        // Create new bill
        const newBill = await Service.createBill({ branchName, billedBy, customerName, contactNo, status, paymentMethod, billTotalAmount, receivedAmount });

        // Prepare bill products data
        const billProducts = products.map(product => ({

            billNo: newBill.billNo,
            productId: product.productId,
            batchNo: product.batchNo,
            barcode: product.barcode,
            billQty: product.billQty,
            sellingPrice: product.sellingPrice,
            discount: product.discount,
            amount: product.amount,

        }));

        // Create bill products
        const result = await BillProductService.createBillProducts(billProducts);

        if (result.success) {
            SUCCESS(res, SUC_CODES, { message: 'Bill and bill_Product entries created successfully', newBill, newBillProducts: result.newBillProducts }, req.span, 201);
        } else {
            ERROR(res, { message: 'Validation error creating bill_Product entries' }, req.span, 400);
        }
        const results = await ProductBatchSum.handleBilling(billProducts, req.body.branchName);

    } catch (error) {
        console.error('Error creating Bill and bill_Product entries:', error);
        ERROR(res, { message: 'Failed to create Bill and bill_Product entries' }, req.span, 500);
    }
};



export const getAllBillsController = async (req, res) => {
    try {
        const bills = await Service.getAllBills(req.query);
        SUCCESS(res, SUC_CODES, bills, req.span);
    } catch (err) {
        console.error('Error fetching all bills:', err);
        ERROR(res, err, req.span);
    }
};


export const getBillDetailsController = async (req, res) => {
    const { billNo } = req.query;

    if (!billNo) {
        return ERROR(res, { message: 'billNo parameter is missing' }, req.span, 400);
    }

    console.log("bill", billNo);

    try {
        const result = await BillProductService.getBillProductsByBillNumber(billNo);
        console.log("Bill Details", result);
        SUCCESS(res, SUC_CODES, result, req.span);
    } catch (error) {
        console.error('Error fetching bill details:', error);
        ERROR(res, { message: 'Failed to fetch bill details', error: error.message }, req.span, 500);
    }
};


export const getBillByNumberController = async (req, res) => {
    try {
        const { billNo } = req.params;
        const bill = await Service.getBillByNumber(billNo);
        if (bill) {
            SUCCESS(res, SUC_CODES, bill, req.span);
        } else {
            ERROR(res, { message: 'Bill not found' }, req.span, 404);
        }
    } catch (error) {
        console.error('Error fetching bill by number:', error);
        ERROR(res, error, req.span);
    }
};



export const updateCustomerDetailsController = async (req, res) => {
    try {
        const { billNo } = req.params;
        const customerData = req.body;
        const updatedBill = await Service.updateCustomerDetailsByBillNumber(billNo, customerData);
        SUCCESS(res, SUC_CODES, updatedBill, req.span);
    } catch (error) {
        console.error('Error updating customer details:', error);
        ERROR(res, error, req.span);
    }
};

export const cancelBillByNumberController = async (req, res) => {
    console.log("Hiiii cancel");
    try {
        const { billNo, products, branchName } = req.body;

        const RefundBillProducts = products.map(product => ({
            billNo,
            productId: product.productId,
            batchNo: product.batchNo,
            billQty: product.billQty,
            returnQty: product.billQty,
            sellingPrice: product.sellingPrice,
            discount: product.discount,
        }));
        const canceledBill = await Service.cancelBillByNumber(billNo);
        if (canceledBill) {
            SUCCESS(res, SUC_CODES, canceledBill, req.span);

            const results = await ProductBatchSum.handleRefund(RefundBillProducts, branchName);
        } else {
            ERROR(res, { message: 'Bill not found' }, req.span, 404);
        }
    } catch (error) {
        console.error('Error canceling bill:', error);
        ERROR(res, error, req.span);
    }
};

export const getSumOfBillTotalAmountForDateController = async (req, res) => {
    try {
        const { branchName, date } = req.query;

        if (!branchName || !date) {
            return ERROR(res, { message: 'branchName and date parameters are required' }, req.span, 400);
        }

        const totalAmount = await Service.getSumOfBillTotalAmountForDate(branchName, date);
        SUCCESS(res, Codes.SUC_CODES, { totalAmount }, req.span);
    } catch (error) {
        console.error('Error fetching sum of billTotalAmount for date:', error);
        ERROR(res, { message: 'Failed to fetch sum of billTotalAmount for date', error: error.message }, req.span, 500);
    }
};

export const getNetTotalAmountForDateController = async (req, res) => {
    try {
        const { branchName, date } = req.query;

        if (!branchName || !date) {
            return ERROR(res, { message: 'branchName and date parameters are required' }, req.span, 400);
        }

        const result = await Service.getNetTotalAmountForDate(branchName, date);
        SUCCESS(res, SUC_CODES, result, req.span);
    } catch (error) {
        console.error('Error fetching net total amount for date:', error);
        ERROR(res, { message: 'Failed to fetch net total amount for date', error: error.message }, req.span, 500);
    }
};


//for chart
export const getDailySalesDataForMonthController = async (req, res) => {
    try {
        const { branchName, year, month } = req.query;

        if (!branchName || !year || !month) {
            return ERROR(res, { message: 'branchName, year, and month parameters are required' }, req.span, 400);
        }

        const salesData = await Service.getDailySalesDataForMonth(branchName, year, month);
        SUCCESS(res, Codes.SUC_CODES, { salesData }, req.span);
    } catch (error) {
        console.error('Error fetching daily sales data for month:', error);
        ERROR(res, { message: 'Failed to fetch daily sales data for month', error: error.message }, req.span, 500);
    }
};