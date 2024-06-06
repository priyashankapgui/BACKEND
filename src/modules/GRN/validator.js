import Joi from "joi";
import { VALIDATION_ERROR } from "../../helper.js";

const grnSchema = Joi.object({
  invoiceNo: Joi.string().required(),
  branchId: Joi.string().required(),
  supplierId: Joi.string().required(),
  createdAt: Joi.date().default(() => new Date(), 'current date').required(),
});

const create = async (req, res, next) => {
  try {
    await grnSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error", error);
  }
};

const update = async (req, res, next) => {
  try {
    await grnSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default {
  create,
  update,
};
