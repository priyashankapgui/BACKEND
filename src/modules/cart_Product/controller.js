import ShoppingCart from '../cart_Customer/shoppingcart.js';
import CartProduct from '../cart_Product/cartProduct.js';

export const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartProduct.findAll();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToCart = async (req, res) => {
  const { productId, productName, sellingPrice, quantity, discount } = req.body;

  try {
    const [cart, created] = await ShoppingCart.findOrCreate({ where: {} });
    await CartProduct.create({
      cartId: cart.cartId,
      productId,
      productName,
      sellingPrice,
      quantity,
      discount,
    });

    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cartProduct = await CartProduct.findOne({ where: { productId } });
    if (cartProduct) {
      cartProduct.quantity = quantity;
      await cartProduct.save();
      res.status(200).json({ message: 'Cart item updated successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cartProduct = await CartProduct.findOne({ where: { productId } });
    if (cartProduct) {
      await cartProduct.destroy();
      res.status(200).json({ message: 'Cart item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

