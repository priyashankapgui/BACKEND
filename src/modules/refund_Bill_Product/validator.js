import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

// Schema to validate refund bill product data
const CreateRefundBillProductSchema = Joi.object({
    RTBNo: Joi.string().required(),
    productId: Joi.string().required(),
    batchNo: Joi.string().required(),
    productName: Joi.string().required(),
    returnQty: Joi.number().integer().min(1).required(),
    returnAmount: Joi.string().required(),
    reason: Joi.string().required(),
});

// Middleware function to validate refund bill product data
const create = async (req, res, next) => {
    try {
        await CreateRefundBillProductSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
        console.log('Validation error:', error);
    }
};

export default {
    create,
};
