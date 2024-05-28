// import { Router } from "express";
// import cartProductController from "../cart_Product/controller.js";

// const router = Router();

// router.post("/cartProducts", cartProductController.createCartProduct);
// router.get("/cartProducts", cartProductController.getCartProducts);
// router.get("/cartProducts/:id", cartProductController.getCartProductById);
// router.put("/cartProducts/:id", cartProductController.updateCartProduct);
// router.delete("/cartProducts/:id", cartProductController.deleteCartProduct);

// export default router;



// backend/routes/cart.js
import express from 'express';
import ShoppingCart from '../cart_Customer/shoppingcart.js';
import cart_Product from '../cart_Product/cartProduct.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    // Find or create a shopping cart for the customer
    let cart = await ShoppingCart.findOne({ where: { customerId } });
    if (!cart) {
      cart = await ShoppingCart.create({ customerId });
    }

    // Add the product to the cart
    const cartProduct = await cart_Product.create({
      shoppingcartCartId: cart.cartId,
      productProductId: productId,
      quantity,
    });

    res.status(200).json({ message: 'Product added to cart successfully', cartProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
});

export default router;
