import Joi from "joi";
import { VALIDATION_ERROR } from "../../helper.js";

const supplierSchema = Joi.object({
  supplierName: Joi.string().required(),
  regNo: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  contactNo: Joi.string().required(),
});

const create = async (req, res, next) => {
  try {
    await supplierSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error", error);
  }
};

const update = async (req, res, next) => {
  try {
    await supplierSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default {
  create,
  update,
};
