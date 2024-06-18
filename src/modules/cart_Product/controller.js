import { addToCart, getCartItems, updateCartItem, deleteCartItem } from './service.js';

export const addToCartController = async (req, res) => {
  try {
    const { customerId, productId, productName, branchId, sellingPrice, quantity, discount } = req.body;
    const cartProduct = await addToCart(customerId, productId, productName, branchId, sellingPrice, quantity, discount);
    res.status(200).json(cartProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartItemsController = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cartItems = await getCartItems(customerId);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItemController = async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const cartProduct = await updateCartItem(customerId, productId, quantity);
    res.status(200).json(cartProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItemController = async (req, res) => {
  try {
    const { customerId, productId } = req.body;
    const result = await deleteCartItem(customerId, productId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
