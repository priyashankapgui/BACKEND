import Joi from "joi";
import { VALIDATION_ERROR } from "../../helper.js";

const createBillSchema = Joi.object({
    billNo: Joi.string().required(),
    productId: Joi.string().required(),
    barcode: Joi.string().optional(),
    productName: Joi.string().required(),
    billQty: Joi.number().integer().min(1).required(),
    sellingPrice: Joi.number().required(),
    batchNo: Joi.string().required(),
    discount: Joi.number().optional(),
    amount: Joi.number().required(),
    paymentMethod: Joi.string().required(),
    billTotalAmount: Joi.number().required(),
});

const create = async (req, res, next) => {
    try {
        await createBillSchema.validateAsync(req.body);
        next();
    } catch (error) {
        VALIDATION_ERROR(res, error);
        console.log("Validation error:", error);
    }
};

export default {
    create
};
