import * as OnlineBillProductService from './service.js';

export const addProductsToBill = async (req, res) => {
  const { onlineBillNo } = req.body;

  try {
    const result = await OnlineBillProductService.addProductsToBill(onlineBillNo);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all OnlineBillProduct entries
export const getAllOnlineBillProducts = async (req, res) => {
  try {
    const onlineBillProducts = await OnlineBillProductService.getAllOnlineBillProducts();
    res.status(200).json(onlineBillProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get OnlineBillProduct entries by onlineBillNo
export const getOnlineBillProductsByBillNo = async (req, res) => {
  const { onlineBillNo } = req.params;
  try {
    const onlineBillProducts = await OnlineBillProductService.getOnlineBillProductsByBillNo(onlineBillNo);
    res.status(200).json(onlineBillProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
