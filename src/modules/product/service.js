import { Op } from "sequelize";
import products from "../product/product.js";
import categories from "../category/category.js";
import productRouter from "../product/routes.js";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";



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
        "barcode",
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



// Service function to get productId by productName
export const getProductIdByProductNameService = async (productName) => {
  try {
    const product = await products.findOne({
      where: { productName },
      attributes: ['productId']
    });

    return product ? product.productId : null;
  } catch (error) {
    console.error("Error fetching productId by productName:", error);
    throw new Error("Error fetching productId by productName");
  }
};



export const searchSuppliersByProductName = async (productId) => {
  try {
    // Query the productSupplier model to find suppliers for the given productId
    const suppliersDetails = await productSupplier.findAll({
      where: { productId },
      include: [{ model: suppliers, attributes: ['branchName', 'supplierId', 'supplierName', 'regNo', 'email', 'address', 'contactNo'] }]
    });

    return suppliersDetails;
  } catch (error) {
    console.error("Error searching suppliers by product ID:", error);
    throw new Error("Error getting suppliers by product ID");
  }
}; 











//Update the qty of a product
// export const updateProductQty = async (productId, totalQty) => {
//   try {
//     // Find the product by productId
//     const product = await products.findByPk(productId);
    
//     // Update the quantity
//     if (product) {
//       await product.update({ qty: product.qty + totalQty });
//     } else {
//       throw new Error(`Product with ID ${productId} not found.`);
//     }
//   } catch (error) {
//     throw new Error(`Error updating product quantity: ${error.message}`);
//   }
// };




// // Service function to get productId and corresponding supplierName by productName
// export const getProductDetailsByProductName = async (productName) => {
//   try {
//     // Find the product by productName
//     const product = await products.findOne({
//       where: { productName },
//       include: [
//         {
//           model: productSupplier,
//           include: [suppliers] // Include suppliers association
//         }
//       ]
//     });

//     if (!product) {
//       return null; // Return null if product not found
//     }

//     // Extract productId and corresponding supplierName
//     const productId = product.productId;
//     const supplierName = product.product_Suppliers.length > 0 ? product.product_Suppliers[0].supplier.supplierName : null;

//     return { productId, supplierName };
//   } catch (error) {
//     console.error("Error fetching product details by productName:", error);
//     throw new Error("Error fetching product details by productName");
//   }
// };