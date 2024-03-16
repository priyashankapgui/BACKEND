// import { getAllStocks, getStockById, addStock , deleteStockById, updateStockById } from '../stock/service.js';

import { addStock, getAllStocks, getStockById, updateStockById, deleteStockById } from '../stock/service.js';


export const createStock = async (req, res) => {
  const { GRN_NO, invoiceNo, productId, productName,  batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, supplierName, branch, comment } = req.body;
  try {
    const newStock = await addStock({ GRN_NO, invoiceNo, productId, productName,  batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, supplierName, branch, comment });
    res.status(201).json(newStock);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStocks = async (req, res) => {
  try {
    const stocksAll = await getAllStocks();
    res.status(200).json(stocksAll);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getStock = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;
  
  try {
    const stock = await getStockById(GRN_NO);
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateStock = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;
  const updatedStockData = req.body;
  
  try {
    const updatedStock = await updateStockById(GRN_NO, updatedStockData);
    res.status(200).json(updatedStock);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteStock = async (req, res) => {
  const GRN_NO = req.params.GRN_NO;
  
  try {
    await deleteStockById(GRN_NO);
    res.status(204).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


