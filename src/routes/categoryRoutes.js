import express from 'express';
import { createCategory, getCategory, deleteCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();


router.post('/', createCategory);

router.get('/', getCategory);

router.delete('/:categoryId', deleteCategory);

router.put('/:categoryId', updateCategory);

export default router;

