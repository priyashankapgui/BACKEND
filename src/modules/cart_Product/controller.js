import * as cartProductServ from './service.js';

export const getCartItemsByCartId = async (req, res) => {
  const { cartId } = req.params; // Assuming cartId is passed as a route parameter

  try {
    const cartItems = await cartProductServ.getCartItems(cartId);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to add an item to the cart
export const addToCart = async (req, res, next) => {
  const { customerId, productId, productName, batchNo, branchId, sellingPrice, quantity, discount } = req.body;
  try {
    const addedCartItem = await cartProductServ.addToCart(customerId, productId, productName, batchNo, branchId, sellingPrice, quantity, discount);
    res.json(addedCartItem);
  } catch (error) {
    next(error);
  }
}

export const updateCartItem = async (req, res, next) => {
  const { cartId, productId } = req.params;  // Extract cartId and productId from request params
  const updatedFields = req.body;  // Extract updated fields from request body
  try {
    const updatedCartItem = await cartProductServ.updateCartItem(cartId, productId, updatedFields);  // Pass both cartId and productId
    res.json(updatedCartItem);
  } catch (error) {
    next(error);
  }
}

export const deleteCartItem = async (req, res, next) => {
  const { cartId, productId } = req.params;  // Extract cartId and productId from request params
  try {
    const result = await cartProductServ.deleteCartItem(cartId, productId);  // Pass both cartId and productId
    res.json(result);
  } catch (error) {
    next(error);
  }
}
