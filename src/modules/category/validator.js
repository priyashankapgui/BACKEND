import Joi from "joi";
import {VALIDATION_ERROR} from "../../helper.js"

const categorySchema = Joi.object({
  categoryName: Joi.string().required(),
});

const create = async (req, res, next) => {
  try {
    await categorySchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error",error);
  } 
};

const update = async (req, res, next) => {
  try {
    await categorySchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default  {
  create,
  update,
};
