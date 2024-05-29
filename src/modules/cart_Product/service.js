import cartProduct from "../cart_Product/cartProduct.js";

const createCartProductservice = async (shoppingcartCartId, productProductId, quantity) => {
  return await cartProduct.create({ shoppingcartCartId, productProductId, quantity });
};

const getCartProductsservice = async () => {
  return await cartProduct.findAll();
};

const getCartProductByIdservice = async (id) => {
  return await cartProduct.findByPk(id);
};

const updateCartProductservice = async (id, quantity) => {
  const cartProductToUpdate = await cartProduct.findByPk(id);
  if (!cartProductToUpdate) return null;
  cartProductToUpdate.quantity = quantity;
  await cartProductToUpdate.save();
  return cartProductToUpdate;
};

const deleteCartProductservice = async (id) => {
  const cartProductToDelete = await cartProduct.findByPk(id);
  if (!cartProductToDelete) return null;
  await cartProductToDelete.destroy();
  return true;
};

export default {
  createCartProductservice,
  getCartProductsservice,
  getCartProductByIdservice,
  updateCartProductservice,
  deleteCartProductservice,
};
