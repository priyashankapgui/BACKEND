import { Op } from "sequelize";
import products from "../product/product.js";
import categories from "../category/category.js";
import productRouter from "../product/routes.js";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";
import branches from "../branch/branch.js";
import productSupplier from "../product_Supplier/product_Supplier.js";
import { mapBranchNameToId } from "../branch/service.js";



export const generateProductID = async (branchName) => {
  try {
    if (!branchName || typeof branchName !== 'string') {
      throw new Error('Invalid branchName: ' + branchName);
    }

    // Extract the first three letters of the branch name
    const branchCode = branchName.substring(0, 3).toUpperCase();

    // Get the last product ID for the specific branch from the database
    const lastProductID = await getLastProductID(branchCode);
    let lastNumber = 0; // Default to 0 if no previous product ID exists

    if (lastProductID) {
      lastNumber = parseInt(lastProductID.split('P')[1]); // Extract the number part
      if (isNaN(lastNumber)) {
        throw new Error('Invalid product ID format');
      }
    }

    // Increment the last number
    lastNumber++;

    // Pad the number with leading zeros
    const paddedNumber = lastNumber.toString().padStart(5, '0');

    // Construct the product ID
    const productID = `${branchCode}-P${paddedNumber}`;

    return productID;
  } catch (error) {
    throw new Error('Error generating product ID: ' + error.message);
  }
};

const getLastProductID = async (branchCode) => {
  try {
    const latestProduct = await products.findOne({
      where: {
        productId: {
          [Op.like]: `${branchCode}-P%`, // Match the product IDs starting with the branch code
        },
      },
      order: [['createdAt', 'DESC']], // Order by creation date in descending order to get the latest entry
    });

    return latestProduct ? latestProduct.productId : null; // Return null if there are no product entries for the branch
  } catch (error) {
    throw new Error('Error getting last product ID: ' + error.message);
  }
};


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


//============================
export const getAllproductsweb = async () => {
  try{
      const productsReq = await products.findAll();
      console.log(productsReq);
      return productsReq;
  }catch (error) {
      console.error('Error retrieving products:', error);
      throw new Error('Error retrieving products');
  }
};
//===============================

export const getProductByIdAndBranchName = async (productId, branchId) => {
  try {
    // Fetch product details
    const product = await products.findOne({
      where: { productId, branchId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Fetch category details
    const category = await categories.findOne({
      where: { categoryId: product.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Fetch branch details
    const branch = await branches.findOne({
      where: { branchId },
    });

    if (!branch) {
      throw new Error("Branch not found");
    }

    // Fetch supplier details
    const productSupplierdata = await productSupplier.findOne({
      where: { productId },
    });

    if (!productSupplierdata) {
      throw new Error("Supplier not found for the product");
    }

    const supplier = await suppliers.findOne({
      where: { supplierId: productSupplierdata.supplierId },
    });

    if (!supplier) {
      throw new Error("Supplier not found");
    }

    // Extract product details from the product GRNs
    const result = {
      branchName: branch.branchName,
      productId: product.productId,
      productName: product.productName,
      categoryName: category.categoryName,
      description: product.description,
      supplierName: supplier.supplierName,
    };

    return result;
  } catch (error) {
    throw new Error("Error retrieving product details: " + error.message);
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
// export const searchProductsByCategoryName = async (categoryName) => {
//   try {
//     const category = await categories.findOne({
//       where: { categoryName },
//     });

//     if (!category) {
//       return [];
//     }
//     const categoryId = category.categoryId;
//     const productsInCategory = await products.findAll({
//       where: { categoryId },
//       attributes: [
//         "productId",
//         "productName",
//         "description",
//         "image",
//         "barcode",
//         "createdAt",
//         "updatedAt",
//       ],
//     });

//     return productsInCategory;
//   } catch (error) {
//     console.error("Error retrieving products by category name:", error);
//     throw new Error("Error retrieving products by category name");
//   }
// };

export const getProductsByCategoryNameAndBranchName = async (categoryName, branchId) => {
  try {
    // Fetch category details to get the categoryId
    const category = await categories.findOne({
      where: { categoryName },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const categoryId = category.categoryId;

    // Fetch products based on categoryId and branchId
    const productsList = await products.findAll({
      where: { categoryId, branchId },
    });

    if (!productsList || productsList.length === 0) {
      throw new Error("No products found");
    }

    // Fetch branch details
    const branch = await branches.findOne({
      where: { branchId },
    });

    if (!branch) {
      throw new Error("Branch not found");
    }

    // Fetch supplier details for each product
    const results = await Promise.all(
      productsList.map(async (product) => {
        const productSupplierdata = await productSupplier.findOne({
          where: { productId: product.productId },
        });

        if (!productSupplierdata) {
          throw new Error("Supplier not found for the product");
        }

        const supplier = await suppliers.findOne({
          where: { supplierId: productSupplierdata.supplierId },
        });

        if (!supplier) {
          throw new Error("Supplier not found");
        }

        return {
          branchName: branch.branchName,
          productId: product.productId,
          productName: product.productName,
          categoryName: category.categoryName,
          description: product.description,
          supplierName: supplier.supplierName,
        };
      })
    );

    return results;
  } catch (error) {
    throw new Error("Error retrieving product details: " + error.message);
  }
};



 
// Function to add a new product
export const addProduct = async (productData) => {
  try {
    const branchName = productData.branchName;
    console.log("Branch",branchName);
    const productId = await generateProductID(branchName);

    const branchId = await mapBranchNameToId(branchName);
    

    if (!branchId) {
      res.status(404).json({ error: "Branch not found" });
      return;
    }
    
    
    // Ensure branchData includes the generated branchId
    const newProduct = await products.create({ productId,branchId, ...productData });
  

 // Create new record in product_Supplier table
 await productSupplier.create({
  supplierId: productData.supplierId ,
  productId: newProduct.productId
});
} catch (error) {
throw new Error(error.message);
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





// Function to retrieve a product by its ID with its associated category
// export const getProductById = async (productId) => {
//   try {
//     const productbyId = await products.findByPk(productId, {
//       include: {
//         model: categories,
//         as: "category",
//         attributes: ["categoryName", "description"],
//       },
//     });
//     return productbyId;
//   } catch (error) {
//     throw new Error("Error fetching product: " + error.message);
//   }
// };

// export const getProductByIdAndBranchName = async (  productId, branchId) => {
//   try {
   
//     const product = await products.findOne({
//       where: { productId, branchId },
      
//     });
//     if (!product) {
//       throw new Error("Product not found");
//     }

//     return product;
//   } catch (error) {
//     throw new Error("Error fetching product: " + error.message);
//   }
// };







// export const getProductByIdAndBranchName = async (productId, branchId) => {
//   try {
 

//     // Step 2: Find the product with associations
//     const product = await products.findOne({
//       where: { productId, branchId },
//       include: [
//         {
//           model: categories,
//           as: 'category',
//           attributes: ['categoryName'],
//         },
//         {
//           model: suppliers,
//           as: 'suppliers',
//           attributes: ['supplierName'],
//           through: { attributes: [] } // To remove the intermediate table attributes
//         }
//       ]
//     });

//     if (!product) {
//       throw new Error("Product not found");
//     }

//     // Step 3: Extract category name and supplier names
//     const categoryName = product.category ? product.category.categoryName : null;
//     const supplierNames = product.suppliers.map(supplier => supplier.supplierName);

//     // Step 4: Prepare the final product object with category name and supplier names
//     const result = {
//       productId: product.productId,
//       productName: product.productName,
//       branchId: product.branchId,
//       description: product.description,
//       image: product.image,
//       barcode: product.barcode,
//       qty: product.qty,
//       categoryId: product.categoryId,
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt,
//       categoryName: categoryName,
//       supplierNames: supplierNames
//     };

//     return result;
//   } catch (error) {
//     throw new Error("Error fetching product: " + error.message);
//   }
// };





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