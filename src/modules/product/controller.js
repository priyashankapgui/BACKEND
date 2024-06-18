import express from "express";
import path from "path";
import multer from "multer";
import * as ProductBatchSumService from "../productBatchSum/service.js";
import * as Service from "../product/service.js"
import { mapSupplierNameToId } from "../supplier/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../category/constants.js";

const { SUC_CODES } = Codes;



 

// Controller function to get all products
export const getProducts = async (req, res) => {
try {
  const result = await Service.getAllProducts(req.query);
  SUCCESS(res, SUC_CODES, result, req.span);
} catch (err) {
  console.log(err);
  ERROR(res, err, res.span);
}
};


//Function to get product using productId
export const getProduct = async (req, res) => {

try {
  const result = await Service.getProductById(req.params.productId);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
}; 



//function to get product details using categoryName
export const getProductsByCategory = async (req, res) => {
   const { categoryId } = req.query;
   console.log("cataaa1",categoryId);

  try {
    const results = await Service.getProductsByCategoryName(categoryId);
    SUCCESS(res, 200, results, req.span); 
  } catch (err) {
    console.error("Error fetching products:", err);
    ERROR(res, err, req.span);
  }
};





// Controller function to update a product
export const updateProduct = async (req, res) => {

try {
  const result = await Service.updateProductById(req.params.productId, req.body);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};



//Function to create a product
export const createProduct = async (req, res) => {
  const { productName, description, categoryName, barcode, minQty } = req.body;
 
  try{
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

   const image = req.file.path;
   const result = await Service.addProduct({
        productName,
        description,
        categoryName,
        image,
        barcode,
        minQty
    });

    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    ERROR(res, error, res.span);
  }
};


// Controller function to delete a product
export const deleteProduct = async (req, res) => {
  try {
    const result = await Service.deleteProductById(req.params.productId);
  
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.log(error);
  
    ERROR(res, error, res.span);
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



//Function to get active stock
export const getTotalQuantityByBranchAndProduct = async (req, res) => {
  try { 
    const { branchName, productId } = req.query;
    const result = await ProductBatchSumService.getProductTotalQuantity(branchName, productId);
SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};








