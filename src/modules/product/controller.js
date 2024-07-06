import * as ProductBatchSumService from "../productBatchSum/service.js";
import * as Service from "../product/service.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../category/constants.js";
import cloudinary from "../../blobService/cloudinary.js";

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
  try {
    const results = await Service.getProductsByCategoryName(categoryId);
    SUCCESS(res, 200, results, req.span);
  } catch (err) {
    console.error("Error fetching products:", err);
    ERROR(res, err, req.span);
  }
};

// // Controller function to update a product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProductData = { ...req.body };
    if (req.file) {
      console.log("file", req.file);
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        req.file.stream.pipe(stream);
      });

      updatedProductData.image = uploadRes.secure_url;
    } else if (req.body.image) {
      // Handle base64 encoded image upload
      const uploadRes = await cloudinary.uploader.upload(req.body.image, {
        upload_preset: "flexflow",
      });
      updatedProductData.image = uploadRes.secure_url;
    }

    const result = await Service.updateProductById(
      productId,
      updatedProductData
    );
    SUCCESS(res, 200, result, req.span);
  } catch (error) {
    console.log(error);
    ERROR(res, error, res.span);
  }
};

//function to create product
export const createProduct = async (req, res) => {
  const { productName, description, categoryName, barcode, minQty, image } =
    req.body;

  try {
    let imageUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "flexflow",
      });
      imageUrl = uploadRes.secure_url;
    }
    const result = await Service.addProduct({
      productName,
      description,
      categoryName,
      image: imageUrl,
      barcode,
      minQty,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
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

//Function to get active stock
export const getTotalQuantityByBranchAndProduct = async (req, res) => {
  try {
    const { branchName, productId } = req.query;
    const result = await ProductBatchSumService.getProductTotalQuantity(
      branchName,
      productId
    );
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    console.log(error);
    ERROR(res, error, res.span);
  }
};
