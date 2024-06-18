import CartProduct from '../cart_Product/cartProduct.js';
import ProductBatchSum from '../productBatchSum/productBatchSum.js';
import { getCustomerById } from '../customer/service.js';

export const addToCart = async (productId, productName, branchId, sellingPrice, quantity, discount) => {
  try {
    // Get the user object from session storage
    const userJson = sessionStorage.getItem('user');

    if (!userJson) {
      throw new Error('User not found in session storage');
    }

    // Parse the JSON string to get the user object
    const user = JSON.parse(userJson);
    const customerId = user.customerId;

    if (!customerId) {
      throw new Error('Customer ID not found in user object');
    }

    // Fetch the customer by ID
    const customer = await getCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get the customer's cart ID
    const cartId = customer.cartId;

    // Fetch the batch number with the longest expiry date for the given productId and branchId
    const productBatch = await ProductBatchSum.findOne({
      where: { productId, branchId },
      order: [['expDate', 'DESC']]
    });

    if (!productBatch) {
      throw new Error('Product batch not found in the selected branch');
    }

    const { batchNo } = productBatch;

    // Create a cart product entry
    const cartProduct = await CartProduct.create({
      cartId,
      productId,
      productName,
      batchNo,
      branchId,
      sellingPrice,
      quantity,
      discount,
    });

    return cartProduct;
  } catch (error) {
    throw new Error('Error adding to cart: ' + error.message);
  }
};



export const getCartItems = async (customerId) => {
  try {
    // Fetch the customer by ID
    const customer = await getCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get the customer's cart ID
    const cartId = customer.cartId;

    // Fetch all cart items for the customer's cart
    const cartItems = await CartProduct.findAll({ where: { cartId } });

    return cartItems;
  } catch (error) {
    throw new Error('Error fetching cart items: ' + error.message);
  }
};

export const updateCartItem = async (customerId, productId, quantity) => {
  try {
    // Fetch the customer by ID
    const customer = await getCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get the customer's cart ID
    const cartId = customer.cartId;

    // Find the cart product entry by cartId and productId
    const cartProduct = await CartProduct.findOne({ where: { cartId, productId } });

    if (!cartProduct) {
      throw new Error('Cart item not found');
    }

    // Update the quantity
    cartProduct.quantity = quantity;
    await cartProduct.save();

    return cartProduct;
  } catch (error) {
    throw new Error('Error updating cart item: ' + error.message);
  }
};

export const deleteCartItem = async (customerId, productId) => {
  try {
    // Fetch the customer by ID
    const customer = await getCustomerById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get the customer's cart ID
    const cartId = customer.cartId;

    // Find the cart product entry by cartId and productId
    const cartProduct = await CartProduct.findOne({ where: { cartId, productId } });

    if (!cartProduct) {
      throw new Error('Cart item not found');
    }

    // Delete the cart product entry
    await cartProduct.destroy();

    return { message: 'Cart item deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting cart item: ' + error.message);
  }
};
