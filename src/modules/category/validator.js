import Joi from "joi";
import {VALIDATION_ERROR} from "../../helper.js"

const createcategorySchema = Joi.object({
  categoryName: Joi.string().required(),
});

const updatecategorySchema = Joi.object({
  categoryName: Joi.string().optional(),
});

const create = async (req, res, next) => {
  try {
    await createcategorySchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error",error);
  } 
};

const update = async (req, res, next) => {
  try {
    await updatecategorySchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default  {
  create,
  update,
};
