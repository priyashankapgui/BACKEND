import BillProduct from './bill_Product.js';

export const addBillProduct = async (billProductData) => {
    try {
        const newBillProduct = await BillProduct.create(billProductData);
        await adjustProductQuantity(billProductData.productId, billProductData.branchName, billProductData.batchNo, -billProductData.quantity);
        return newBillProduct;
    } catch (error) {
        throw new Error('Failed to add BillProduct');
    }
};

export const getAllBillProducts = async () => {
    try {
        const billProducts = await BillProduct.findAll();
        return billProducts;
    } catch (error) {
        throw new Error('Failed to retrieve BillProducts');
    }
};

export const getBillProductsByBillNo = async (billNo) => {
    try {
        const billProducts = await BillProduct.findAll({ where: { billNo } });
        return billProducts;
    } catch (error) {
        throw new Error('Failed to retrieve BillProducts by bill number');
    }
};

export const getBillProductsByProductId = async (productId) => {
    try {
        const billProducts = await BillProduct.findAll({ where: { productId } });
        return billProducts;
    } catch (error) {
        throw new Error('Failed to retrieve BillProducts by product ID');
    }
};

export const updateBillProduct = async (billNo, productId, updateData) => {
    try {
        const billProduct = await BillProduct.findOne({ where: { billNo, productId } });
        if (!billProduct) {
            throw new Error('BillProduct not found');
        }
        const updatedBillProduct = await billProduct.update(updateData);
        return updatedBillProduct;
    } catch (error) {
        throw new Error('Failed to update BillProduct');
    }
};

export const deleteBillProduct = async (billNo, productId) => {
    try {
        const billProduct = await BillProduct.findOne({ where: { billNo, productId } });
        if (!billProduct) {
            throw new Error('BillProduct not found');
        }
        await billProduct.destroy();
        return { message: 'BillProduct deleted successfully' };
    } catch (error) {
        throw new Error('Failed to delete BillProduct');
    }
};
