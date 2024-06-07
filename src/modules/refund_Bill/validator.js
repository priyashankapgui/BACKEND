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
