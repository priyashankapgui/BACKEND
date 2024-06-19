import Joi from 'joi';
import { VALIDATION_ERROR } from '../../helper.js';

// Define the validation schema for creating a stock transfer
const createStockTransferSchema = Joi.object({

  requestBranch: Joi.string().required(),
  supplyingBranch: Joi.string().required(),
  requestedBy: Joi.string().required(),
  submittedBy: Joi.string().allow(null, ''),
  submittedAt: Joi.date().allow(null),
  status: Joi.string().allow(null),
});

// Define the validation schema for updating a stock transfer
const updateStockTransferSchema = Joi.object({

  requestBranch: Joi.string().optional(),
  supplyingBranch: Joi.string().optional(),
  requestedBy: Joi.string().optional(),
  submittedBy: Joi.string().optional(),
  submittedAt: Joi.date().optional(),
  status: Joi.string().optional(),
});

// Middleware to validate stock transfer creation
const create = async (req, res, next) => {
  try {
    await createStockTransferSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("Validation error:", error);
  }
};

// Middleware to validate stock transfer update
const update = async (req, res, next) => {
  try {
    await updateStockTransferSchema.validateAsync(req.body);
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
