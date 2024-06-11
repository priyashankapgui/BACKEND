import * as Service from './service.js';
import * as BillProductService from '../bill_Product/service.js';

export const getAllBills = async (req, res) => {
    try {
        const bills = await Service.getAllBills();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBillByNumber = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const bill = await Service.getBillByNumber(billNo);
        if (bill) {
            res.status(200).json(bill);
        } else {
            res.status(404).json({ error: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBill = async (req, res) => {
    try {
        const { branchId, billedBy, customerName, contactNo, status, products } = req.body;
        const newBill = await Service.createBill({ branchId, billedBy, customerName, contactNo, status });
        const { billNo } = newBill;

        const billProducts = products.map(product => ({
            billNo,
            productId: product.productId,
            batchNo: product.batchNo,
            barcode: product.barcode,
            productName: product.productName,
            billQty: product.billQty,
            sellingPrice: product.sellingPrice,
            discount: product.discount,
            amount: product.amount,
            paymentMethod: product.paymentMethod,
            billTotalAmount: product.billTotalAmount
        }));

        const result = await BillProductService.createBillProducts(billProducts);

        if (result.success) {
            res.status(201).json({ message: 'Bill and bill_Product entries created successfully', newBill, newBillProducts: result.newBillProducts });
        } else {
            res.status(400).json({ message: 'Validation error creating bill_Product entries' });
        }
    } catch (error) {
        console.error('Error creating Bill and bill_Product entries:', error);
        res.status(500).json({ message: 'Failed to create Bill and bill_Product entries' });
    }
};

export const updateCustomerDetails = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const customerData = req.body;
        const updatedBill = await Service.updateCustomerDetailsByBillNumber(billNo, customerData);
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelBillByNumber = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const canceledBill = await Service.cancelBillByNumber(billNo);
        if (canceledBill) {
            res.status(200).json(canceledBill);
        } else {
            res.status(404).json({ error: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
