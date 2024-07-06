import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

// Define the validation schema for creating a transfer product
const createTransferProductSchema = Joi.object({
  STN_NO: Joi.string().required(),
  productId: Joi.string().required(),
  requestedQty: Joi.number().required(),
  comment: Joi.string().allow(null, ''),
});

// Define the validation schema for updating a transfer product
const updateTransferProductSchema = Joi.object({
  STN_NO: Joi.string().optional(),
  productId: Joi.string().optional(),
  requestedQty: Joi.number().optional(),
  comment: Joi.string().optional(),
});

// Middleware to validate transfer product creation
const create = async (req, res, next) => {
  try {
    await createTransferProductSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("Validation error:", error);
  }
};

// Middleware to validate transfer product update
const update = async (req, res, next) => {
  try {
    await updateTransferProductSchema.validateAsync(req.body);
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
