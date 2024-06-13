import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

const createBillSchema = Joi.object({
    branchId: Joi.string().required(),
    branchName: Joi.string().required(),
    billedBy: Joi.string().required(),
    customerName: Joi.string().optional(),
    contactNo: Joi.string().optional(),
    paymentMethod: Joi.string().required(),
    billTotalAmount: Joi.number().required(),
    status: Joi.string().valid('Completed','Canceled'),
    products: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        batchNo: Joi.string().required(),
        barcode: Joi.string().optional(),
        productName: Joi.string().required(),
        billQty: Joi.number().required(),
        sellingPrice: Joi.number().required(),
        discount: Joi.number().optional(),
        amount: Joi.number().required(),
    })).required()
});

const updateBillSchema = Joi.object({
    customerName: Joi.string().optional(),
    contactNo: Joi.string().optional(),
});

const create = async (req, res, next) => {
    try {
        await createBillSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
        console.log('Validation error:', error);
    }
};

const update = async (req, res, next) => {
    try {
        await updateBillSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
    }
};

export default {
    create,
    update,
};
