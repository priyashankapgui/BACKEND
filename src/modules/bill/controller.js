import {
    getAllBillData,
    getbillDataByNoService,
    addbillDataService,
    cancellbillDatabyNoService
} from '../bill/service.js';

export const getBillData = async (req, res) => {
    try {
        const bills = await getAllBillData();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBillDataByNo = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const bill = await getbillDataByNoService(billNo);
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
        const billData = req.body;  // Assuming the bill data comes from the request body
        console.log('Received bill data:', billData);  // Debugging log
        const newBill = await addbillDataService(billData);
        res.status(201).json(newBill);
    } catch (error) {
        console.error('Error adding bill data:', error);
        res.status(500).json({ message: error.message });
    }
};

export const cancelBillDataByNo = async (req, res) => {
    try {
        const billNo = req.params.billNo;
        const canceledBill = await cancellbillDatabyNoService(billNo);
        if (canceledBill) {
            res.status(200).json(canceledBill);
        } else {
            res.status(404).json({ error: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
