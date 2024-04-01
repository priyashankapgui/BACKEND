import { createInvoiceService, getAllInvoices, getInvoiceById } from '../invoice/service.js';

export const createInvoice = async (req, res) => {
    const { invoiceNo } = req.body;
    try {
      const newInvoice = await createInvoiceService({ invoiceNo });
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvoiceById = async (req, res) => {
  const invoiceNo = req.params.invoiceNo;
  try {
    const invoice = await getInvoiceById(invoiceNo);
    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

