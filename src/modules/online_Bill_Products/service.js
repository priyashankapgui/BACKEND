import sequelize from '../../../config/database.js';
import OnlineBillProduct from './online_Bill_Products.js';
import CartProduct from '../cart_Product/cartProduct.js';
import OnlineBill from '../online_Bill/onlineBill.js';
import Customer from '../customer/customer.js'; 
import ProductBatchSum from '../productBatchSum/productBatchSum.js';

export const addProductsToBill = async (onlineBillNo) => {
  const transaction = await sequelize.transaction();
  try {
    const onlineBill = await OnlineBill.findOne({ where: { onlineBillNo } });
    if (!onlineBill) {
      return {
        httpCode: 400,
        type: 'BAD_REQUEST',
        code: 500,
        message: '"onlineBillNo" is invalid or not found',
        success: false,
      };
    }
    const customerId = onlineBill.customerId;

    const customer = await Customer.findOne({ where: { customerId } });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const cartId = customer.cartId;

    const cartProducts = await CartProduct.findAll({ where: { cartId } });

    if (cartProducts.length === 0) {
      throw new Error('No products found in the cart');
    }

    let billProducts = [];

    for (const cartProduct of cartProducts) {
      const { productId, batchNo, branchId, quantity, sellingPrice, discount } = cartProduct;

      const productBatchSum = await ProductBatchSum.findOne({
        where: { productId, batchNo, branchId },
      });

      if (!productBatchSum || productBatchSum.totalAvailableQty < quantity) {
        throw new Error(`Insufficient stock for product: ${productId}, batch: ${batchNo}`);
      }

      
      productBatchSum.totalAvailableQty -= quantity;
      await productBatchSum.save({ transaction });

      
      try {
        const newBillProduct = await OnlineBillProduct.create({
          onlineBillNo,
          productId,
          batchNo,
          branchId,
          productName: productBatchSum.productName,
          sellingPrice: sellingPrice,
          PurchaseQty: quantity,
          discount: discount,
          createdAt: new Date()
        }, { transaction });

        
        billProducts.push(newBillProduct);
      } catch (createError) {
        console.error('Error creating OnlineBillProduct:', createError);
        throw createError;
      }
    }

    await transaction.commit();

    return { message: 'Products added to online bill successfully', billProducts };

  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

// Function to get all OnlineBillProduct entries
export const getAllOnlineBillProducts = async () => {
  try {
    const onlineBillProducts = await OnlineBillProduct.findAll();
    return onlineBillProducts;
  } catch (error) {
    throw new Error(`Error fetching OnlineBillProducts: ${error.message}`);
  }
};

// Function to get OnlineBillProduct entries by onlineBillNo
export const getOnlineBillProductsByBillNo = async (onlineBillNo) => {
  try {
    const onlineBillProducts = await OnlineBillProduct.findAll({ where: { onlineBillNo } });
    return onlineBillProducts;
  } catch (error) {
    throw new Error(`Error fetching OnlineBillProducts by bill number: ${error.message}`);
  }
};
