// import productSupplier from "../product_Supplier/product_Supplier.js";

// export const createProductSupplierService = async ({
//   productId,
//   supplierId,
// }) => {
//   try {
//     const newProductSupplier = await productSupplier.create({
//       productId,
//       supplierId,
//     });
//     return newProductSupplier;
//   } catch (error) {
//     if (error.name === 'SequelizeValidationError') {
//       throw new Error("Validation error: " + error.message);
//     } else {
//       throw new Error("Error creating product supplier: " + error.message);
//     }
//   }
// };
