import * as onlineBillServices from './service.js';

export const createOnlineBillController = async (req, res) => {
    const { branchId, customerId, acceptedBy, status, hopeToPickup } = req.body;

    try {
        const newBill = await onlineBillServices.createOnlineBill(branchId, customerId, acceptedBy, status, hopeToPickup);
        res.status(201).json(newBill);
    } catch (error) {
        console.error('Error creating online bill:', error);
        res.status(500).json({ message: 'Error creating online bill', error: error.message });
    }
};

export const getAllOnlineBillsController = async (req, res) => {
    const filters = req.query; // Use query parameters for filtering

    try {
        const bills = await onlineBillServices.getAllOnlineBills(filters);
        res.status(200).json(bills);
    } catch (error) {
        console.error('Error fetching online bills:', error);
        res.status(500).json({ message: 'Error fetching online bills', error: error.message });
    }
};

export const getOnlineBillByNumberController = async (req, res) => {
    const { onlineBillNo } = req.params;

    try {
        const bill = await onlineBillServices.getOnlineBillByNumber(onlineBillNo);
        if (bill) {
            res.status(200).json(bill);
        } else {
            res.status(404).json({ message: 'Online bill not found' });
        }
    } catch (error) {
        console.error('Error fetching online bill:', error);
        res.status(500).json({ message: 'Error fetching online bill', error: error.message });
    }
};

export const updateOnlineBillController = async (req, res) => {
    const { onlineBillNo } = req.params;
    const updates = req.body;

    try {
        const updatedBill = await onlineBillServices.updateOnlineBill(onlineBillNo, updates);
        res.status(200).json(updatedBill);
    } catch (error) {
        console.error('Error updating online bill:', error);
        res.status(500).json({ message: 'Error updating online bill', error: error.message });
    }
};
