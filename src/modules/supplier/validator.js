import Joi from "joi";
import { VALIDATION_ERROR } from "../../helper.js";

const creatSupplierSchema = Joi.object({
  supplierName: Joi.string().required(),
  regNo: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  contactNo: Joi.string().required(),
});

const updateSupplierSchema = Joi.object({
  supplierName: Joi.string().optional(),
  regNo: Joi.string().optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  contactNo: Joi.string().optional(),
});

const create = async (req, res, next) => {
  try {
    await creatSupplierSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error", error);
  }
};

const update = async (req, res, next) => {
  try {
    await updateSupplierSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default {
  create,
  update,
};
