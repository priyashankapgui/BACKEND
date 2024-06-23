import { Op } from "sequelize";
import { to, TE } from "../../helper.js";
import products from "../product/product.js";
import categories from "../category/category.js";
import { mapCategoryNameToId } from "../../modules/category/service.js";
import { imageUploadMultiple, imageUploadwithCompression } from "../../blobService/utils.js";




//function to generate the productId
export const generateProductID = async () => {
  try {

    const latestProduct = await products.findOne({
      order: [['productId', 'DESC']],
      attributes: ['productId'],
    });

    let newProductId;

    if (latestProduct && latestProduct.productId) {
   
      const numericPart = parseInt(latestProduct.productId.substring(1), 10);
      const incrementedNumericPart = numericPart + 1;

      newProductId = `P${incrementedNumericPart.toString().padStart(4, '0')}`;
    } else {
 
      newProductId = 'P0001';
    }

    return newProductId;
  } catch (error) {
    console.error('Error generating new product ID:', error);
    throw new Error('Could not generate new product ID');
  }
}



//function yo get all products
export const getAllProducts = async () => {
  const getRecords = products.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      model: categories,
      as: 'category', 
      attributes: ['categoryName']
    }]
  });

  const [err, result] = await to(getRecords);
  if (err) TE(err);
  if (!result) TE("Results not found");

  const mappedResult = result.map(product => ({
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
    barcode: product.barcode
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
      if (!productDetails) TE(`Product details not found for productId: ${product.productId}`);

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
// export const addProduct = async (req, res) => {
//   // console.log("data",req.body.product);
//   const {
   
//     productName,
//     description,
//     categoryName,
//     barcode,
//     minQty,
    
//   } = req.body
//   // const {  productName, description, categoryName, barcode, minQty } = req;
//   console.log("product",productName);
//   const productId = await generateProductID();
//   console.log("productId",productId);

//   const categoryId = await mapCategoryNameToId(categoryName);
//     if (!categoryId) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//   const createSingleRecord = products.create({ productId, productName, categoryId, description, barcode, minQty });
//   if (req.file){
//     await imageUploadwithCompression(req.file, "cms-product", productId);
//   }

//   const [err, result] = await to (createSingleRecord);

//   if (err) TE(err.errors[0] ? err.errors[0].message : err);

// if (!result) TE("Result not found");

// return result;

// };


export const addProduct = async (req) => {
  console.log("data oh", req.body);

  try {
    const productData = req.body; // No need to parse
    console.log("data ha", productData);

    const {
      productName,
      description,
      categoryName,
      barcode,
      minQty,
    } = productData;

    const productId = await generateProductID();
    console.log("productId",productId);
    // Check if the productId already exists
    const existingProduct = await products.findOne({
      where: { productId: productId },
    });
    if (existingProduct) {
      throw new Error("Product ID already exists");
    }

    // Validate category and get categoryId
    const category = await categories.findOne({
      where: { categoryName: categoryName },
    });
    if (!category) {
      throw new Error("Category does not exist");
    }
    const categoryId = category.categoryId; 

    // Create the new product
    const newProduct = await products.create({
      productId,
      productName,
      description,
      categoryId,
      barcode,
      minQty,
    });

    
    if (req.files) {
      console.log("Uploading image:", req.files);
      await imageUploadMultiple(req.files, "cms-product", productId); 
      console.log("Image uploaded successfully");
    } else {
      console.log("No image file to upload");
    }

    return newProduct;
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};




// Function to update a product by its ID
export const updateProductById = async (productId, updatedProductData) => {
  const updateRecord = products.update(updatedProductData, {
    where: { productId: productId },
    returning: true, 
    plain: true
  });

  const [err, result] = await to(updateRecord);
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

  return { message: 'Product successfully deleted' };
};



export const imageUploadTest = async (req, res) => {
  try {
    const response = await imageUploadMultiple(req.files, "cms-product", "product");
    res.status(200).json({ message: response.message, fileNames: response.fileNames });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
