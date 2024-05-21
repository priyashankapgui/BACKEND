import ShoppingCart from "./shoppingcart.js";

export const addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const cartItem = await ShoppingCart.create({ customerId, productId, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Could not add item to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { customerId, productId } = req.params;
    await ShoppingCart.destroy({ where: { customerId, productId } });
    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Could not remove item from cart" });
  }
};
