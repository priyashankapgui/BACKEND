import productSupplier from "../product_Supplier/product_Supplier.js";
import products from "../product/product.js";
import suppliers from "../supplier/supplier.js";

export const createProductSupplierService = async ({
  productId,
  supplierId,
}) => {
  try {
    const newProductSupplier = await productSupplier.create({
      productId,
      supplierId,
    });
    return newProductSupplier;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Error creating product supplier: " + error.message);
    }
  }
};


export const getProductDetailsByProductNameService = async (productName) => {
  try {
    const product = await products.findOne({
      where: { productName },
      include: [{ model: suppliers, attributes: ['supplieNrame'] }],
    });

    return product;
  } catch (error) {
    console.error("Error fetching product details by productName:", error);
    throw new Error("Error fetching product details by productName");
  }
};