import sequelize from '../../../config/database.js';
import bill from '../bill/bill.js';
import BillProduct from './bill_Product.js';
import Product from '../product/product.js';
import { Codes } from "./constants.js";
import branches from '../branch/branch.js';

const { SUC_CODES } = Codes;

export const createBillProducts = async (billProducts) => {
    try {
        if (!Array.isArray(billProducts)) {
            throw new Error('bill_Product entries should be an array');
        }

        const newBillProducts = await Promise.all(billProducts.map(entry => BillProduct.create(entry)));

        return { success: true, newBillProducts };
    } catch (error) {
        console.error('Error creating bill_Products:', error);
        throw new Error('Error creating bill_Products: ' + error.message);
    }
};

export const getAllBillProducts = async () => {
    try {
        const billProducts = await BillProduct.findAll();
        return billProducts;
    } catch (error) {
        console.error('Failed to retrieve BillProducts:', error);
        throw new Error('Failed to retrieve BillProducts');
    }
};

export const getBillProductsByBillNumber = async (billNo) => {
    if (!billNo) {
        throw new Error('billNo parameter is missing');
    }

    console.log("Fetching bill details for:", billNo);
    try {
        // Fetch bill details
        const billDetails = await bill.findOne({
            where: { billNo },
            raw: true,
        });

        if (!billDetails) {
            throw new Error(`Bill not found for billNo: ${billNo}`);
        }

        console.log("Bill details:", billDetails);

        // Fetch branch details
        const branchDetails = await branches.findOne({
            where: { branchId: billDetails.branchId },
            raw: true,
        });

        if (!branchDetails) {
            throw new Error(`Branch not found for branchId: ${billDetails.branchId}`);
        }

        console.log("Branch details:", branchDetails);

        // Fetch bill products
        const billProducts = await BillProduct.findAll({
            where: { billNo },
            attributes: ['barcode', 'productId', 'batchNo', 'billQty', 'sellingPrice', 'discount', 'amount'],
            raw: true,
        });

        if (!billProducts || billProducts.length === 0) {
            throw new Error(`No products found for billNo: ${billNo}`);
        }

        console.log("Bill Products:", billProducts);

        // Fetch product details for each bill product and include productName
        const billProductsWithDetails = await Promise.all(billProducts.map(async (product) => {
            const productDetails = await Product.findOne({
                where: { productId: product.productId },
                raw: true,
            });

            if (!productDetails) {
                throw new Error(`Product not found for productId: ${product.productId}`);
            }

            return {
                productId: product.productId,
                productName: productDetails.productName,
                batchNo: product.batchNo,
                barcode: product.barcode,
                billQty: product.billQty,
                sellingPrice: product.sellingPrice,
                discount: product.discount,
                amount: product.amount,
            };
        }));

        const result = {
            billNo: billDetails.billNo,
            createdAt: billDetails.createdAt,
            branchId: billDetails.branchId,
            branchName: branchDetails.branchName,
            branchAddress: branchDetails.address,
            branchEmail: branchDetails.email,
            branchPhone: branchDetails.contactNumber,
            billedBy: billDetails.billedBy,
            customerName: billDetails.customerName,
            contactNo: billDetails.contactNo,
            paymentMethod: billDetails.paymentMethod,
            status: billDetails.status,
            billTotalAmount: billDetails.billTotalAmount,
            receivedAmount: billDetails.receivedAmount,
            billProducts: billProductsWithDetails,
        };

        console.log("Final result:", result);
        return result;
    } catch (error) {
        console.error('Error fetching bill details:', error);
        throw new Error('Failed to fetch bill details: ' + error.message);
    }
};


export const getBillProductsByProductId = async (productId) => {
    try {
        const billProducts = await BillProduct.findAll({ where: { productId } });
        return billProducts;
    } catch (error) {
        console.error('Failed to retrieve BillProducts by productId:', error);
        throw new Error('Failed to retrieve BillProducts by productId');
    }
};

export const useSuccCodes = async (req, res) => {
    try {
        // Perform some operation
        const result = await SomeOperation();

        // Example usage of SUC_CODES
        return SUCCESS(res, SUC_CODES, result, req.span); // Assuming SUCCESS is a helper function
    } catch (error) {
        console.error('Error performing operation:', error);
        return error(res, error, req.span); // Assuming ERROR is a helper function
    }
};
