import products from '../product/product.js';
import categories from '../category/category.js';
import productRouter from '../product/routes.js';
import sequelize from '../../../config/database.js';



export const getAllProducts = async () => {
    try {
      const productsReq = await products.findAll();
      console.log(productsReq);
      return productsReq;
    } catch (error) {
      throw new Error('Error retrieving products');
    }
  };


export const getProductById = async (productId) => {
    try {
        const productbyId = await products.findByPk(productId, {
            include: {
                model: categories,
                as: 'category', 
                attributes: ['categoryName', 'description'] 
            }
        });
        return productbyId;
    } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
    }
};

  export const addProduct = async (productData) => {
    try {
      const newProduct = await products.create(productData);
      return newProduct;
    } catch (error) {
      throw new Error('Error creating product: ' + error.message);
    }
  };


  export const updateProductById = async (productId, updatedProductData) => {
    try {
      const product = await products.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      await product.update(updatedProductData);
      return product;
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  };


  export const deleteProductById = async (productId) => {
    try {
      const product = await products.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      await product.destroy();
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  };

