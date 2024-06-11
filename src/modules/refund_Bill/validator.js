import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

// Schema to validate refund bill data
const CreateRefundBillSchema = Joi.object({
    billNo: Joi.string().required(),
    branchId: Joi.string().required(),
    branchName: Joi.string().required(),
    returnedBy: Joi.string().required(),
    customerName: Joi.string().optional(),
    reason: Joi.string().required(),
    products: Joi.array().items(Joi.object({
        billNo: Joi.string().required(),
        branchId: Joi.string().required(),
        branchName: Joi.string().required(),
        productId: Joi.string().required(),
        batchNo: Joi.string().required(),
        barcode: Joi.string().required(),
        productName: Joi.string().required(),
        billQty: Joi.string().required(),
        returnQty: Joi.string().required(),
        returnPriceAmount: Joi.string().required(),
        reason: Joi.string().required(),
    })).required()
});


// Middleware function to validate refund bill data
const create = async (req, res, next) => {
    try {
        await CreateRefundBillSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
        console.log('Validation error:', error);
    }
};

export default {
    create,
};
