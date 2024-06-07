import Joi from "joi";
import { VALIDATION_ERROR } from "../../helper.js"; 

const createBranchSchema = Joi.object({
  branchName: Joi.string().required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required()
});

const updateBranchSchema = Joi.object({
  branchName: Joi.string().optional(),
  address: Joi.string().optional(),
  email: Joi.string().email().optional(),
  contactNumber: Joi.string().pattern(/^[0-9]{10,15}$/).optional()
}).min(1); 

const create = async (req, res, next) => {
  try {
    await createBranchSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("Validation error on create:", error);
  }
};

const update = async (req, res, next) => {
  try {
    await updateBranchSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("Validation error on update:", error);
  }
};

export default {
  create,
  update,
};
