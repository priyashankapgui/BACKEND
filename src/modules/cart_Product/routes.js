import express from 'express';
import * as cartProductCtrl from './controller.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const router = express.Router();

router.get("/cart/items/:cartId", /*authenticateTokenWithPermission('online-orders'),*/cartProductCtrl.getCartItemsByCartId);
router.post('/cart-items/add', cartProductCtrl.addToCart);
router.put('/cart/:cartId/item/:productId', /*authenticateTokenWithPermission('online-orders'),*/cartProductCtrl.updateCartItem);
router.delete('/cart/:cartId/item/:productId', /*authenticateTokenWithPermission('online-orders'),*/cartProductCtrl.deleteCartItem);

export default router;
