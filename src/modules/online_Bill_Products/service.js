import sequelize from '../../../config/database.js';
import OnlineBillProduct from './online_Bill_Products.js';
import CartProduct from '../cart_Product/cartProduct.js';
import OnlineBill from '../online_Bill/onlineBill.js';
import Customer from '../customer/customer.js'; 
import ProductBatchSum from '../productBatchSum/productBatchSum.js';

export const addProductsToBill = async (onlineBillNo) => {
  const transaction = await sequelize.transaction();
  try {
    // Fetch customerId from OnlineBill table
    const onlineBill = await OnlineBill.findOne({ where: { onlineBillNo } });
    if (!onlineBillNo) {
      return res.status(400).json({
        httpCode: 400,
        type: 'BAD_REQUEST',
        code: 500,
        message: '"onlineBillNo" is required',
        success: false,
      });
    }
    const customerId = onlineBill.customerId;

    // Fetch shoppingcartCartId from Customer table
    const customer = await Customer.findOne({ where: { customerId } });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const cartId = customer.shoppingcartCartId;

    // Fetch products from Cart_Product table
    const cartProducts = await CartProduct.findAll({ where: { cartId } });

    if (cartProducts.length === 0) {
      throw new Error('No products found in the cart');
    }

    // Iterate over the products and add them to OnlineBillProduct table
    for (const cartProduct of cartProducts) {
      const { productId, batchNo, branchId, quantity, price } = cartProduct;

      // Fetch product info from ProductBatchSum table
      const productBatchSum = await ProductBatchSum.findOne({
        where: { productId, batchNo, branchId },
      });

      if (!productBatchSum || productBatchSum.totalAvailableQty < quantity) {
        throw new Error(`Insufficient stock for product: ${productId}, batch: ${batchNo}`);
      }

      // Deduct the purchased quantity from ProductBatchSum
      productBatchSum.totalAvailableQty -= quantity;
      await productBatchSum.save({ transaction });

      // Calculate PayAmount
      // const payAmount = price * quantity;
      console.log(`Product ID: ${productId}, Batch No: ${batchNo}, Quantity: ${quantity}, Price: ${price}`);

      // Add product to OnlineBillProduct table
      await OnlineBillProduct.create({
        onlineBillNo,
        productId,
        batchNo,
        branchId,
        productName: productBatchSum.productName,
        PurchaseQty: quantity,
        // PayAmount: payAmount,
        createdAt: new Date()
      }, { transaction });
    }

    await transaction.commit();
    return { message: 'Products added to online bill successfully' };

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
