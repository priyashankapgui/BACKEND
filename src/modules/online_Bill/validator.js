import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

const createOnlineBillSchema = Joi.object({
    onlineBillNo: Joi.string().required(),
    branchId: Joi.string().required(),
    customerId: Joi.number().integer().required(),
    acceptedBy: Joi.string().required(),
    status: Joi.string().required()
});

const updateOnlineBillSchema = Joi.object({
    onlineBillNo: Joi.string().optional(),
    branchId: Joi.string().optional(),
    customerId: Joi.number().integer().optional(),
    acceptedBy: Joi.string().optional(),
    status: Joi.string().optional()
});

const create = async (req, res, next) => {
    try {
        await createOnlineBillSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
        console.log('Validation error during online bill creation:', error);
    }
};

const update = async (req, res, next) => {
    try {
        await updateOnlineBillSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
        console.log('Validation error during online bill update:', error);
    }
};

export default {
    create,
    update,
};
