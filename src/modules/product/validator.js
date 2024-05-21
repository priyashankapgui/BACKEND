
//const { VALIDATION_ERROR } = require('../../helper');
import Joi from 'joi';


// Define the validation schema
const productSchema = Joi.object({
  branchName: Joi.string().required(),
  productName: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  categoryName: Joi.string().required(),
  barcode: Joi.string().allow(null, ''),
  // Assuming req.file.path is included in a separate validation for file upload
});

// Validation middleware
export const validateProduct = async (req, res, next) => {
  try {
    await productSchema.validateAsync(req.body);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

