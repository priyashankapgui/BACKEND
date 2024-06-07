import Joi from 'joi';
import { VALIDATION_ERROR } from "../../helper.js";

const salesQuerySchema = Joi.object({
    branchId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
});

const validateSalesQuery = async (req, res, next) => {
    try {
        await salesQuerySchema.validateAsync(req.query);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
    }
};

export default {
    validateSalesQuery
};
