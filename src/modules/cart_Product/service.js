// cartProductService.js

import cart_Product from './cartProduct.js';
import Customer from '../customer/customer.js'; 

// Service to get cart items for a customer
async function getCartItems(customerId) {
  try {
    // Fetch the cartId for the given customerId
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const cartId = customer.cartId;

    // Fetch cart items using the cartId
    const cartItems = await cart_Product.findAll({
      where: { cartId },
    });
    return cartItems;
  } catch (error) {
    throw new Error(`Failed to get cart items: ${error.message}`);
  }
}

// Service to add an item to the cart
async function addToCart(customerId, productId, productName, batchNo, branchId, sellingPrice, quantity, discount) {
  try {
    // Fetch the cartId for the given customerId
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const cartId = customer.cartId;

    // Check if the product is already in the cart
    let cartItem = await cart_Product.findOne({
      where: {
        cartId,
        productId,
      },
    });

    if (cartItem) {
      // If the item already exists in the cart, update its quantity and other fields
      const updatedCartItem = await cartItem.update({
        quantity: cartItem.quantity + quantity,
        sellingPrice,
        discount,
      });
      return updatedCartItem;
    } else {
      // If the item does not exist in the cart, create a new entry
      cartItem = await cart_Product.create({
        cartId,
        productId,
        productName,
        batchNo,
        branchId,
        sellingPrice,
        quantity,
        discount,
      });
      return cartItem;
    }
  } catch (error) {
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
}

async function updateCartItem(cartId, productId, updatedFields) {
  try {
    const cartItem = await cart_Product.findOne({ where: { cartId, productId } });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    const updatedCartItem = await cartItem.update(updatedFields);
    return updatedCartItem;
  } catch (error) {
    throw new Error(`Failed to update cart item: ${error.message}`);
  }
}
async function deleteCartItem(cartId, productId) {
  try {
    const cartItem = await cart_Product.findOne({ where: { cartId, productId } });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    await cartItem.destroy();
    return { message: 'Cart item deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete cart item: ${error.message}`);
  }
}
export { getCartItems, addToCart, updateCartItem, deleteCartItem };
