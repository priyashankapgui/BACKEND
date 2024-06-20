// cartProductController.js

import * as cartProductServ from './service.js';

// Controller to get cart items for a customer
async function getCartItems(req, res, next) {
  const { customerId } = req.body;
  try {
    const cartItems = await cartProductServ.getCartItems(customerId);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
}

// Controller to add an item to the cart
async function addToCart(req, res, next) {
  const { customerId, productId, productName, batchNo, branchId, sellingPrice, quantity, discount } = req.body;
  try {
    const addedCartItem = await cartProductServ.addToCart(customerId, productId, productName, batchNo, branchId, sellingPrice, quantity, discount);
    res.json(addedCartItem);
  } catch (error) {
    next(error);
  }
}

async function updateCartItem(req, res, next) {
  const { cartId, productId } = req.params;  // Extract cartId and productId from request params
  const updatedFields = req.body;  // Extract updated fields from request body
  try {
    const updatedCartItem = await cartProductServ.updateCartItem(cartId, productId, updatedFields);  // Pass both cartId and productId
    res.json(updatedCartItem);
  } catch (error) {
    next(error);
  }
}

async function deleteCartItem(req, res, next) {
  const { cartId, productId } = req.params;  // Extract cartId and productId from request params
  try {
    const result = await cartProductServ.deleteCartItem(cartId, productId);  // Pass both cartId and productId
    res.json(result);
  } catch (error) {
    next(error);
  }
}


export { getCartItems, addToCart, updateCartItem, deleteCartItem };
