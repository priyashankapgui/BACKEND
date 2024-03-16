import products from '../product/product.js';
import stocks from '../stock/stock.js';
import suppliers from '../supplier/supplier.js';


// export const addStock = async (stockData) => {
//   try {
//     const newStock = await stocks.create(stockData);
//     return newStock;
//   } catch (error) {
//     throw new Error('Error creating stock: ' + error.message);
//   }
// };

export const addStock = async (stockData) => {
  try {
    const amount = (stockData.totalQty - stockData.freeQty) * stockData.purchasePrice;
    const stockDataWithAmount = { ...stockData, amount };
    const newStock = await stocks.create(stockDataWithAmount);
    return newStock;
  } catch (error) {
    console.error( 'Error creating stock:', error);
    throw new Error('Error creating stock: ' + error.message);
  }
};

export const getAllStocks = async () => {
  try {
    const stocksAll = await stocks.findAll();
    return stocksAll;
  } catch (error) {
    throw new Error('Error fetching stocks: ' + error.message);
  }
};


export const getStockById = async (GRN_NO) => {
  try {
    const stock = await stocks.findByPk(GRN_NO);
    return stock;
  } catch (error) {
    throw new Error('Error fetching stock: ' + error.message);
  }
};


export const updateStockById = async (GRN_NO, updatedStockData) => {
  try {
    const stock = await stocks.findByPk(GRN_NO);
    if (!stock) {
      throw new Error('Stock not found');
    }
    await stock.update(updatedStockData);
    return stock;
  } catch (error) {
    throw new Error('Error updating stock: ' + error.message);
  }
};


export const deleteStockById = async (GRN_NO) => {
  try {
    const stock = await stocks.findByPk(GRN_NO);
    if (!stock) {
      throw new Error('Stock not found');
    }
    await stock.destroy();
  } catch (error) {
    throw new Error('Error deleting stock: ' + error.message);
  }
};

