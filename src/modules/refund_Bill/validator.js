import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

// Schema to validate refund bill data
const CreateRefundBillSchema = Joi.object({
    billNo: Joi.string().required(),
    branchName: Joi.string().required(),
    returnedBy: Joi.string().required(),
    customerName: Joi.string().optional(),
    contactNo: Joi.string().optional(),
    reason: Joi.string().required(),
    refundTotalAmount: Joi.number().required(),
    products: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        batchNo: Joi.string().required(),
        billQty: Joi.number().required(),
        returnQty: Joi.number().required(),
        sellingPrice: Joi.number().required(),
        discount: Joi.number().optional(),
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
