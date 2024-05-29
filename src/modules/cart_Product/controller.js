import cartProductService from "../cart_Product/service.js";

const createCartProduct = async (req, res) => {
  try {
    const { shoppingcartCartId, productProductId, quantity } = req.body;
    console.log("data",shoppingcartCartId)
    const newCartProduct = await cartProductService.createCartProductservice(shoppingcartCartId, productProductId, quantity);
    res.status(201).json(newCartProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartProducts = async (req, res) => {
  try {
    const cartProducts = await cartProductService.getCartProductsservice();
    res.status(200).json(cartProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartProduct = await cartProductService.getCartProductByIdservice(id);
    if (!cartProduct) {
      res.status(404).json({ error: "Cart product not found" });
    } else {
      res.status(200).json(cartProduct);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedCartProduct = await cartProductService.updateCartProductservice(id, quantity);
    if (!updatedCartProduct) {
      res.status(404).json({ error: "Cart product not found" });
    } else {
      res.status(200).json(updatedCartProduct);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCartProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await cartProductService.deleteCartProductservice(id);
    if (!deleted) {
      res.status(404).json({ error: "Cart product not found" });
    } else {
      res.status(204).json();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createCartProduct,
  getCartProducts,
  getCartProductById,
  updateCartProduct,
  deleteCartProduct,
};
