import express from 'express';
import * as cartProductCtrl from './controller.js';

const router = express.Router();

router.get("/cart/items/:cartId", cartProductCtrl.getCartItemsByCartId);
router.post('/cart-items/add', cartProductCtrl.addToCart);
router.put('/cart/:cartId/item/:productId', cartProductCtrl.updateCartItem);
router.delete('/cart/:cartId/item/:productId', cartProductCtrl.deleteCartItem);

export default router;
