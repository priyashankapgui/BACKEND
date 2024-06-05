
const { VALIDATION_ERROR } = require('../../helper');
import Joi from 'joi';

const createproductSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  categoryName: Joi.string().required(),
  barcode: Joi.string().allow(null, ''),
  // Assuming req.file.path is included in a separate validation for file upload
});

const updateproductSchema = Joi.object({
  productName: Joi.string().optional(),
  description: Joi.string().optional(),
  categoryName: Joi.string().optional(),
  barcode: Joi.string().optional(),
  // Assuming req.file.path is included in a separate validation for file upload
});




// Validation middleware
// export const validateProduct = async (req, res, next) => {
//   try {
//     await productSchema.validateAsync(req.body);
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
//     next();
//   } catch (error) {
//     VALIDATION_ERROR(res, error);
//   }
// };

const validateProductCreate = async (req, res, next) => {
  try {
    await createproductSchema.validateAsync(req.body);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
    console.log("this generate error", error);
  }
};

const validateProductUpdate = async (req, res, next) => {
  try {
    await updateproductSchema.validateAsync(req.body);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
  } catch (error) {
    VALIDATION_ERROR(res, error);
  }
};

export default {
  validateProductCreate,
  validateProductUpdate,
};