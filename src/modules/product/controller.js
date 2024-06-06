import express from "express";
import path from "path";
import multer from "multer";
import products from "../product/product.js";
//import { validateProduct } from "./validator.js";
import { mapCategoryNameToId } from "../../modules/category/service.js";
import { getProductTotalQuantity } from "../productBatchSum/service.js";
import {getAllProducts} from "../product/service.js";
// import {
//   getAllProducts,
//   getProductById,
//   addProduct,
//   searchProductsByName,
//   getProductsByCategoryName,
//   deleteProductById,
//   updateProductById,
//   getProductIdByProductNameService,
//   searchSuppliersByProductName,
// } from "../product/service.js";
import * as Service from "../product/service.js"
import { mapSupplierNameToId } from "../supplier/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../category/constants.js";

const { SUC_CODES } = Codes;



 

// Controller function to get all products
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// try {
//   const result = await Service.getAllProducts(req.query);
//   SUCCESS(res, SUC_CODES, result, req.span);
// } catch (err) {
//   console.log(err);
//   ERROR(res, err, res.span);
// }
// };


//Function to get product using productId
export const getProduct = async (req, res) => {
  const productId = req.params.productId;
  

  try {

    // Fetch product by productId 
    const result= await Service.getProductById(productId);
    if (!result) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// function to get product using categoryName
export const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.query;
  console.log("categoryName", categoryName);

  try {
    // Fetch products by categoryName and branchId
    const results = await Service.getProductsByCategoryName(categoryName);
    if (!results || results.length === 0) {
      res.status(404).json({ error: "No products found" });
      return;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller function to update a product
export const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;
  try {
    const updatedProduct = await Service.updateProductById(
      productId,
      updatedProductData
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Controller function to create a new product
export const createProduct = async (req, res) => {
  
  const {  productName, description, categoryName, barcode } = req.body;
 
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const categoryId = await mapCategoryNameToId(categoryName);
    if (!categoryId) {
      return res.status(404).json({ error: "Category not found" });
    }

   const image = req.file.path;
      
      const newProduct = await Service.addProduct({
        
        productName,
        description,
        categoryId,
        image,
        barcode,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Controller function to delete a product
export const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    await Service.deleteProductById(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



//upload image controller

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src\\Image')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

 export const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000'},
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if(mimeType && extname) {
      return cb(null, true)
    }
    cb('Give proper file format to upload')
  }
}).single('image')




export const getTotalQuantityByBranchAndProduct = async (req, res) => {
  try {
    const { branchName, productId } = req.query;
    const totalQuantity = await getProductTotalQuantity(branchName, productId);

    res.status(200).json({ totalQuantity });
  } catch (error) {
    console.error("Error retrieving total quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};







// //Controller function to get productId and corresponding supplierName by productName
// export const getProductDetailsByProductNameController = async (req, res) => {
//   const { productName } = req.params;

//   try {
//     if (!productName) {
//       res.status(400).json({ error: "Product name is required" });
//       return;
//     }

//     // Call the service function to get product details
//     const productDetails = await getProductDetailsByProductName(productName);

//     if (!productDetails) {
//       res.status(404).json({ error: "No product found for the given product name" });
//       return;
//     }

//     // Return the product details
//     res.status(200).json(productDetails);
//   } catch (error) {
//     console.error("Error fetching product details by product name:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };




// // Controller function to search products by name
// export const getStocksByProductName = async (req, res) => {
//   const { productName } = req.params;
  
//   try {
//     if (!productName) {
//       res.status(400).json({ error: "Product name is required" });
//       return;
//     }
  
//     const searchResults = await searchProductsByName(productName);
//     res.status(200).json(searchResults);
//   } catch (error) {
//     console.error("Error searching products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// Controller function to get products by category name
// export const getProductsByCategoryName = async (req, res) => {
//   const { categoryName } = req.params;

//   try {
//     if (!categoryName) {
//       res.status(400).json({ error: "Category name is required" });
//       return;
//     }
  
//     const products = await searchProductsByCategoryName(categoryName);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products by category name:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// //Controller function to get productId by productName
// export const getProductIdByProductNameController = async (req, res) => {
//   const { productName } = req.params;

//   try {
//     const productId = await getProductIdByProductNameService(productName);
//     if (!productId) {
//       res.status(404).json({ error: "Product not found" });
//       return;
//     }
//     res.status(200).json({ productId });
//   } catch (error) {
//     console.error("Error fetching productId by productName:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// export const getProductAndSuppliersDetailsByProductName = async (req, res) => {
//   const { productName } = req.params;

//   try {
//     if (!productName) {
//       return res.status(400).json({ error: "Product name is required" });
//     }
  
//     const product = await products.findOne({
//       where: { productName },
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     const productId = product.productId;

//     // Retrieve the supplier details for the product
//     const suppliersDetails = await searchSuppliersByProductName(productId);
    
//     // Construct the response object with product and supplier details
//     const response = {
//       productId: product.productId,
//       productName: product.productName,
//       suppliers: suppliersDetails
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error fetching product and suppliers details by product name:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
