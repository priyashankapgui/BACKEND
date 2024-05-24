import { Router } from "express";
import cartProductController from "../cart_Product/controller.js";

const router = Router();

router.post("/cartProducts", cartProductController.createCartProduct);
router.get("/cartProducts", cartProductController.getCartProducts);
router.get("/cartProducts/:id", cartProductController.getCartProductById);
router.put("/cartProducts/:id", cartProductController.updateCartProduct);
router.delete("/cartProducts/:id", cartProductController.deleteCartProduct);

export default router;
