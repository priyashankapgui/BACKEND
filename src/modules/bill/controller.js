import * as Service from '../bill/service.js';

export const getBillData = async (req, res) => {
    try {
        const bills = await Service.getAllBillData();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBillDataByNo = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const bill = await Service.getbillDataByNoService(billNo);
        if (bill) {
            res.status(200).json(bill);
        } else {
            res.status(404).json({ error: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addBillData = async (req, res) => {
    try {
        const billData = req.body;
        console.log('Received bill data:', billData);
        const newBill = await Service.addbillDataService(billData);
        res.status(201).json(newBill);
    } catch (error) {
        console.error('Error adding bill data:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateCustomerDetails = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const customerData = req.body;
        const updatedBill = await Service.updateCustomerDetailsByBillNo(billNo, customerData);
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelBillDataByNo = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const canceledBill = await Service.cancellbillDatabyNoService(billNo);
        if (canceledBill) {
            res.status(200).json(canceledBill);
        } else {
            res.status(404).json({ error: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
