import { VALIDATION_ERROR } from "../../helper.js";
import Joi from 'joi';

const createproductSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  categoryName: Joi.string().required(),
  barcode: Joi.string().allow(null, ''),
  image: Joi.string().allow(null, ''),  // Updated to accept image as a string
  minQty: Joi.number().allow(null, ''),
});

const updateproductSchema = Joi.object({
  productName: Joi.string().optional(),
  description: Joi.string().optional(),
  categoryName: Joi.string().optional(),
  barcode: Joi.string().optional(),
  image: Joi.string().allow(null, ''),  // Updated to accept image as a string
  minQty: Joi.number().allow(null, ''),
  
});

const validateProductCreate = async (req, res, next) => {
  try {
    await createproductSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

const validateProductUpdate = async (req, res, next) => {
  try {
    await updateproductSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default {
  validateProductCreate,
  validateProductUpdate,
};
