import express from 'express';
import { getCartItems, addToCart, updateCartItem, deleteCartItem } from '../cart_Product/controller.js';

const router = express.Router();

router.get('/cart', getCartItems);
router.post('/cart', addToCart);
router.put('/cart/:productId', updateCartItem);
router.delete('/cart/:productId', deleteCartItem);

export default router;
