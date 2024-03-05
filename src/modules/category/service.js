import categories from '../category/category.js';
import sequelize from '../../../config/database.js';

export const getAllCategories = async () => {
    try {
      const categoryReq = await categories.findAll();
      return categoryReq;
    } catch (error) {
      throw new Error('Error retrieving categories');
    }
};


export const getCategoryById = async (categoryId) => {
    try {
      const category = await categories.findByPk(categoryId);
      return category;
    } catch (error) {
      throw new Error('Error fetching category: ' + error.message);
    }
};


export const addCategory = async (categoryData) => {
    try {
      const newCategory = await categories.create(categoryData);
      return newCategory;
    } catch (error) {
      throw new Error('Error creating category: ' + error.message);
    }
};


export const updateCategoryById = async (categoryId, updatedCategoryData) => {
    try {
      const category = await categories.findByPk(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      await category.update(updatedCategoryData);
      return category;
    } catch (error) {
      throw new Error('Error updating category: ' + error.message);
    }
};


export const deleteCategoryById = async (categoryId) => {
    try {
      const category = await categories.findByPk(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      await category.destroy();
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting category: ' + error.message);
    }
};
