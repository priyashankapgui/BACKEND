import sequelize from "../../../config/database.js";
import products from "../product/product.js";
// import {   adjustProductGRNQuantity } from "../product_GRN/service.js";
// import { updateProductQty } from "../productBatchSum/service.js";
import {   adjustProductGRNQuantity,getAllProductGRN } from "../product_GRN/service.js";

//=============================================
export const getproductGRN = async (req, res) => {
  try {
    const branchesList = await getAllProductGRN(); 
    res.status(200).json(branchesList);  
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};
//=================================================

export const adjustProductQuantity = async (req, res) => {
  try {
    const { productName, branchName, batchNo, newQuantity } = req.body;

    
    await adjustProductGRNQuantity(productName, branchName, batchNo, newQuantity);

    const product = await products.findOne({ where: { productName } });
    if (!product) {
      throw new Error("Product not found.");
    }
    await updateProductQty(product.productId);

    res.status(200).json({ message: "Product quantity adjusted successfully." });
  } catch (error) {
    console.error("Error adjusting product quantity:", error);
    res.status(500).json ({ error: "Internal server error" });
  }
};



















































 

  // export const getAvailableQuantityByBranchAndProduct = async (req, res) => {
  //   try {
  //     const { branchName, productName } = req.query;
  //     console.log('Received branchName:', branchName);
  //     console.log('Received productName:', productName);

  //     if (!productName || !branchName) {
  //       throw new Error("Please provide both productName and branchName");
  //     }
      
  //     const availableQuantity = await getProductGRNAvailableQuantity(branchName, productName);
  
  //     res.status(200).json({ availableQuantity });
  //   } catch (error) {
  //     console.error("Error retrieving available quantity:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // };

  // export const getAvailableQuantityByBranchAndProduct = async (req, res) => {
  //   try {
  //     const { branchName, productName } = req.query;
  //     console.log('Received branchName:', branchName);
  //     console.log('Received productName:', productName);

  //     if (!productName || !branchName) {
  //       throw new Error("Please provide both productName and branchName");
  //     }
      
  //     const availableQuantity = await getProductGRNAvailableQuantity(branchName, productName);
  
  //     res.status(200).json({ availableQuantity });
  //   } catch (error) {
  //     console.error("Error retrieving available quantity:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // };

  // export const getAvailableQuantityByBranchAndProduct = async (req, res) => {
  //   try {
  //     const { branchName, productName } = req.query;
  //     console.log('Received branchName:', branchName);
  //     console.log('Received productName:', productName);
  
  //     if (!productName || !branchName) {
  //       throw new Error("Please provide both productName and branchName");
  //     }
      
  //     const availableQuantity = await getProductGRNAvailableQuantity(branchName, productName);
  
  //     res.status(200).json({ availableQuantity });
  //   } catch (error) {
  //     console.error("Error retrieving available quantity:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // };




  // export const createProductGRN = async (req, res) => {
//   try{

//     const { productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment} = req.body;
//     const newProductGRN = await createProductGRNService({
//       productId, GRN_NO, batchNo, totalQty, purchasePrice, sellingPrice, freeQty, expDate, amount, comment
//     });
//     res.status(201).json(newProductGRN);
//   } catch (error) {
//     console.error("Error creating product GRN:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };