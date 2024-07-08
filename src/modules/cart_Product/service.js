// cartProductService.js

import cart_Product from './cartProduct.js';
import Customer from '../customer/customer.js'; 
import ProductBatchSum from '../productBatchSum/productBatchSum.js';
import Product from '../product/product.js'

async function getCartItems(cartId) {
  try {
    // Fetch cart items along with their associated products
    const cartItems = await cart_Product.findAll({
      where: { cartId },
      include: [
        {
          model: Product,
          attributes: ['productId', 'productName'],
        },
      ],
    });

    // Fetch sellingPrice and discount from ProductBatchSum for each cart item
    const cartItemsWithPriceAndDiscount = await Promise.all(cartItems.map(async (cartItem) => {
      const productBatch = await ProductBatchSum.findOne({
        where: {
          productId: cartItem.productId,
          batchNo: cartItem.batchNo,
          branchId: cartItem.branchId,
        },
      });

      if (productBatch) {
        return {
          ...cartItem.toJSON(),
          sellingPrice: productBatch.sellingPrice,
          discount: productBatch.discount,
        };
      } else {
        return {
          ...cartItem.toJSON(),
          sellingPrice: null,
          discount: null,
        };
      }
    }));

    return cartItemsWithPriceAndDiscount;
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
    
    // Fetch the batch number with the longest expiry date for the given productId and branchId
    const productBatch = await ProductBatchSum.findOne({
      where: { productId, branchId },
      order: [['expDate', 'DESC']],
    });

    if (!productBatch) {
      throw new Error('Product batch not found in the selected branch');
    }

    const { batchNo } = productBatch;

    // Check if the product is already in the cart
    let cartItem = await cart_Product.findOne({
      where: {
        cartId,
        productId,
      },
    });

    if (cartItem) {
      // If the item already exists in the cart, update its quantity and other fields
      await cartItem.update({
        quantity: cartItem.quantity + quantity,
        sellingPrice,
        discount,
      });
    } else {
      // If the item does not exist in the cart, create a new entry
      await cart_Product.create({
        cartId,
        productId,
        productName,
        batchNo,
        branchId,
        sellingPrice,
        quantity,
        discount,
        customerId,
      });
    }

    const totalProductCount = await cart_Product.count({
      where: {
        cartId,
      },
      distinct: true,
      col: 'productId',
    });

    return { totalProductCount };
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
