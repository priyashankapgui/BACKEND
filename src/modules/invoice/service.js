import invoices from '../invoice/invoices.js';


export const createInvoiceService = async (invoiceData) => {
    try {
      const newInvoice = await invoices.create(invoiceData);
      return newInvoice;
    } catch (error) {
      throw new Error('Error creating invoice');
    }
  };

export const getAllInvoices = async () => {
  try {
    const allInvoices = await invoices.findAll();
    return allInvoices;
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    throw new Error('Error retrieving invoices');
  }
};

export const getInvoiceById = async (invoiceNo) => {
  try {
    const invoice = await invoices.findByPk(invoiceNo);
    return invoice;
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    throw new Error('Error retrieving invoice');
  }
};
