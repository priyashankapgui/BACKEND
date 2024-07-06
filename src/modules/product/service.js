import { to, TE } from "../../helper.js";
import products from "../product/product.js";
import categories from "../category/category.js";
import { mapCategoryNameToId } from "../../modules/category/service.js";

//function to generate the productId
export const generateProductID = async () => {
  try {
    const latestProduct = await products.findOne({
      order: [["productId", "DESC"]],
      attributes: ["productId"],
    });
    let newProductId;
    if (latestProduct && latestProduct.productId) {
      const numericPart = parseInt(latestProduct.productId.substring(1), 10);
      const incrementedNumericPart = numericPart + 1;
      newProductId = `P${incrementedNumericPart.toString().padStart(4, "0")}`;
    } else {
      newProductId = "P0001";
    }
    return newProductId;
  } catch (error) {
    console.error("Error generating new product ID:", error);
    throw new Error("Could not generate new product ID");
  }
};

//function yo get all products
export const getAllProducts = async () => {
  const getRecords = products.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: categories,
        as: "category",
        attributes: ["categoryName"],
      },
    ],
  });
  const [err, result] = await to(getRecords);
  if (err) TE(err);
  if (!result) TE("Results not found");
  const mappedResult = result.map((product) => ({
    productId: product.productId,
    productName: product.productName,
    barcode: product.barcode,
    categoryName: product.category.categoryName,
    description: product.description,
  }));
  return mappedResult;
};

//Function to get product using productId
export const getProductById = async (productId) => {
  const getProduct = products.findOne({
    where: { productId },
  });
  const [err, product] = await to(getProduct);
  if (err) TE(err);
  if (!product) TE("Product not found");

  const getCategory = categories.findOne({
    where: { categoryId: product.categoryId },
  });
  const [categoryErr, category] = await to(getCategory);
  if (categoryErr) TE(categoryErr);
  if (!category) TE("Category not found");

  const result = {
    productId: product.productId,
    productName: product.productName,
    categoryName: category.categoryName,
    description: product.description,
    barcode: product.barcode,
    minQty: product.minQty,
  };

  return result;
};

//function to get product details by categoryName
export const getProductsByCategoryName = async (categoryId) => {
  const getCategory = categories.findOne({
    where: { categoryId: categoryId },
  });
  const [categoryErr, category] = await to(getCategory);
  if (categoryErr) TE(categoryErr);
  if (!category) TE("Category not found");

  const [productsErr, productsList] = await to(
    products.findAll({ where: { categoryId } })
  );
  if (productsErr) TE(productsErr);
  if (!productsList || productsList.length === 0) TE("No products found");

  const results = await Promise.all(
    productsList.map(async (product) => {
      const [productDetailsErr, productDetails] = await to(
        products.findOne({ where: { productId: product.productId } })
      );
      if (productDetailsErr) TE(productDetailsErr);
      if (!productDetails)
        TE(`Product details not found for productId: ${product.productId}`);

      return {
        productId: productDetails.productId,
        productName: productDetails.productName,
        barcode: productDetails.barcode,
        categoryName: category.categoryName,
        description: productDetails.description,
      };
    })
  );

  return results;
};

//Function to add product
export const addProduct = async (productData) => {
  const { productName, description, categoryName, barcode, image, minQty } =
    productData;
  const productId = await generateProductID();
  const categoryId = await mapCategoryNameToId(categoryName);
  if (!categoryId) {
    throw new Error("Category not found");
  }
  const createSingleRecord = products.create({
    productId,
    productName,
    categoryId,
    description,
    barcode,
    image,
    minQty,
  });
  const [err, result] = await to(createSingleRecord);
  if (err) throw new Error(err.errors[0] ? err.errors[0].message : err);
  if (!result) throw new Error("Result not found");
  return result;
};

// // Function to update a product by its ID
export const updateProductById = async (productId, updatedProductData) => {
  const [err, result] = await to(
    products.update(updatedProductData, {
      where: { productId: productId },
      returning: true,
      plain: true,
    })
  );

  if (err) TE(err);
  if (!result) TE("Result not found");
  const updatedRecord = await products.findByPk(productId);
  if (!updatedRecord) TE("Updated result not found");
  return updatedRecord;
};

// Function to delete a product by its ID
export const deleteProductById = async (productId) => {
  const deleteRecord = products.destroy({ where: { productId: productId } });
  const [err, result] = await to(deleteRecord);
  if (err) TE(err);
  if (result === 0) TE("Product not found or already deleted");
  return { message: "Product successfully deleted" };
};
