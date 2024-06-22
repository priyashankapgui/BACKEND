import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

// Define the validation schema for creating a transfer product batch
const createTransferProductBatchSchema = Joi.object({
  STN_NO: Joi.string().required(),
  productId: Joi.string().required(),
  batchNo: Joi.string().required(),
  transferQty: Joi.number().required(),
  unitPrice: Joi.number().required(),
  amount: Joi.number().required(),
});

// Define the validation schema for updating a transfer product batch
const updateTransferProductBatchSchema = Joi.object({
  STN_NO: Joi.string().optional(),
  productId: Joi.string().optional(),
  batchNo: Joi.string().optional(),
  transferQty: Joi.number().optional(),
  unitPrice: Joi.number().optional(),
  amount: Joi.number().optional(),
});

// Middleware to validate transfer product batch creation
const create = async (req, res, next) => {
  try {
    await createTransferProductBatchSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("Validation error:", error);
  }
};

// Middleware to validate transfer product batch update
const update = async (req, res, next) => {
  try {
    await updateTransferProductBatchSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("Validation error:", error);
  }
};

export default {
  create,
  update,
};
