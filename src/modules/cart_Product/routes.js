import express from 'express';
import { addToCartController, getCartItemsController, updateCartItemController, deleteCartItemController } from './controller.js';

const router = express.Router();

router.post('/cart', addToCartController);
router.get('/cart/:customerId', getCartItemsController);
router.put('/cart', updateCartItemController);
router.delete('/cart', deleteCartItemController);

// router.put('/cart/:productId', updateCartItem);
// router.delete('/cart/:productId', deleteCartItem);

export default router;



