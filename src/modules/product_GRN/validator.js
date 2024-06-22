
import Joi from "joi";
import { VALIDATION_ERROR } from "../../helper.js";

const createProductGRNSchema = Joi.object({
  productId: Joi.string().required(),
  GRN_NO: Joi.string().required(),
  batchNo: Joi.string().required(),
  totalQty: Joi.number().integer().required(),
  purchasePrice: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  freeQty: Joi.number().integer().required(),
  expDate: Joi.date().allow(null),
  amount: Joi.number().required(),
  comment: Joi.string().allow(null),
});



const validateProductGRN = async (req, res) => {
  try {
    await createProductGRNSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.error("Validation error:", error);
  }
};



export default validateProductGRN;
