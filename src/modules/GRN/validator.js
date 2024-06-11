import Joi from "joi";
import { VALIDATION_ERROR } from '../../helper.js';

const grnSchema = Joi.object({
  invoiceNo: Joi.string().required(),
  branchName: Joi.string().required(),
  supplierId: Joi.string().required(),
  
  
});


const validateGRN = async (req, res) => {
  try {
    await grnSchema.validateAsync(req.body);
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error", error);
  }
};

export default validateGRN;
