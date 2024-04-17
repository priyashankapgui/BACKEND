import categories from "../category/category.js";
import sequelize from "../../../config/database.js";

// Function to get all categories
export const getAllCategories = async () => {
  try {
    const categoryReq = await categories.findAll();
    return categoryReq;
  } catch (error) {
    throw new Error("Error retrieving categories");
  }
};

// Function to get a category by its ID
export const getCategoryById = async (categoryId) => {
  try {
    const category = await categories.findByPk(categoryId);
    return category;
  } catch (error) {
    throw new Error("Error fetching category: " + error.message);
  }
};

// Function to add a new category
export const addCategory = async (categoryData) => {
  try {
    const newCategory = await categories.create(categoryData);
    return newCategory;
  } catch (error) {
    throw new Error("Error creating category: " + error.message);
  }
};

// Function to update a category by its ID
export const updateCategoryById = async (categoryId, updatedCategoryData) => {
  try {
    const category = await categories.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    await category.update(updatedCategoryData);
    return category;
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};

// Function to delete a category by its ID
export const deleteCategoryById = async (categoryId) => {
  try {
    const category = await categories.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    await category.destroy();
    return { message: "Category deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};

// Function to map a category name to its ID
export const mapCategoryNameToId = async (categoryName) => {
  try {
    const category = await categories.findOne({
      where: { categoryName: categoryName },
    });
    if (category) {
      return category.categoryId;
    } else {
      throw new Error("Category not found");
    }
  } catch (error) {
    throw new Error("Error mapping category name to ID: " + error.message);
  }
};
