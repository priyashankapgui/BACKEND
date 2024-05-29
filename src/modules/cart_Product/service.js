import cartProduct from "../cart_Product/cartProduct.js";

const createCartProduct = async (shoppingcartCartId, productProductId, quantity) => {
  return await cartProduct.create({ shoppingcartCartId, productProductId, quantity });
};

const getCartProducts = async () => {
  return await cartProduct.findAll();
};

const getCartProductById = async (id) => {
  return await cartProduct.findByPk(id);
};

const updateCartProduct = async (id, quantity) => {
  const cartProductToUpdate = await cartProduct.findByPk(id);
  if (!cartProductToUpdate) return null;
  cartProductToUpdate.quantity = quantity;
  await cartProductToUpdate.save();
  return cartProductToUpdate;
};

const deleteCartProduct = async (id) => {
  const cartProductToDelete = await cartProduct.findByPk(id);
  if (!cartProductToDelete) return null;
  await cartProductToDelete.destroy();
  return true;
};

export default {
  createCartProduct,
  getCartProducts,
  getCartProductById,
  updateCartProduct,
  deleteCartProduct,
};
