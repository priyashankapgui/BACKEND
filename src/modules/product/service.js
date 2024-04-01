import { Op } from "sequelize";
import products from "../product/product.js";
import categories from "../category/category.js";
import productRouter from "../product/routes.js";
import sequelize from "../../../config/database.js";

// Function to retrieve all products with their associated categories
export const getAllProducts = async () => {
  try {
    const productsReq = await products.findAll({
      include: [
        //associated model should be loaded along with the main model
        {
          model: categories,
          as: "category",
          attributes: ["categoryId", "categoryName", "description"],
        },
      ],
    });
    console.log(productsReq);
    return productsReq;
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw new Error("Error retrieving products");
  }
};

// Function to retrieve a product by its ID with its associated category
export const getProductById = async (productId) => {
  try {
    const productbyId = await products.findByPk(productId, {
      include: {
        model: categories,
        as: "category",
        attributes: ["categoryName", "description"],
      },
    });
    return productbyId;
  } catch (error) {
    throw new Error("Error fetching product: " + error.message);
  }
};

// Function to search products by name using a partial match
export const searchProductsByName = async (productName) => {
  try {
    const searchResults = await products.findAll({
      where: {
        productName: {
          [Op.like]: `%${productName}%`, // Using Sequelize's like operator to search for partial matches
        },
      },
    });
    return searchResults;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Error searching products");
  }
};

// Function to search products by category name
export const searchProductsByCategoryName = async (categoryName) => {
  try {
    const category = await categories.findOne({
      where: { categoryName },
    });

    if (!category) {
      return [];
    }
    const categoryId = category.categoryId;
    const productsInCategory = await products.findAll({
      where: { categoryId },
      attributes: [
        "productId",
        "productName",
        "description",
        "image",
        "createdAt",
        "updatedAt",
      ],
    });

    return productsInCategory;
  } catch (error) {
    console.error("Error retrieving products by category name:", error);
    throw new Error("Error retrieving products by category name");
  }
};

// Function to add a new product
export const addProduct = async (productData) => {
  try {
    const newProduct = await products.create(productData);
    return newProduct;
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};

// Function to update a product by its ID
export const updateProductById = async (productId, updatedProductData) => {
  try {
    const product = await products.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    await product.update(updatedProductData);
    return product;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

// Function to delete a product by its ID
export const deleteProductById = async (productId) => {
  try {
    const product = await products.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    await product.destroy();
    return { message: "Product deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};
