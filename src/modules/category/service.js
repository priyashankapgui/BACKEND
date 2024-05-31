import { to, TE } from "../../helper.js";
import categories from "../category/category.js";
import database from "../category/database.js";
import sequelize from "../../../config/database.js";



 const generateCategoryId = async () => {
  try {
    // Fetch the latest category ID
    const latestCategory = await categories.findOne({
      order: [['categoryId', 'DESC']],
      attributes: ['categoryId'],
    });

    let newCategoryId;

    if (latestCategory && latestCategory.categoryId) {
      // Extract the numeric part of the latest category ID and increment it
      const numericPart = parseInt(latestCategory.categoryId.substring(3), 10);
      const incrementedNumericPart = numericPart + 1;

      // Format the new category ID with leading zeros
      newCategoryId = `CAT${incrementedNumericPart.toString().padStart(5, '0')}`;
    } else {
      // If there are no existing categories, start with CAT00001
      newCategoryId = 'CAT00001';
    }

    return newCategoryId;
  } catch (error) {
    console.error('Error generating new category ID:', error);
    throw new Error('Could not generate new category ID');
  }
}



// Function to get all categories
 const getAllCategories = async () => {
  try {
    const categoryReq = await categories.findAll();
    return categoryReq;
  } catch (error) {
    throw new Error("Error retrieving categories");
  }
};

// Function to get a category by its ID
 const getCategoryById = async (categoryId) => {
  try {
    const category = await categories.findByPk(categoryId);
    return category;
  } catch (error) {
    throw new Error("Error fetching category: " + error.message);
  }
};

// Function to add a new category
 const addCategory = async (data) => {
  
    const categoryId = await generateCategoryId();
    
    const createSingleRecord = database.createSingleRecord({ categoryId, ...data });

    const [err, result] = await to (createSingleRecord);

    if (err) TE(err.errors[0] ? err.errors[0].message : err);

  if (!result) TE("Result not found");

  return result;
  
 
};

// Function to update a category by its ID
 const updateCategoryById = async (categoryId, updatedCategoryData) => {
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
 const deleteCategoryById = async (categoryId) => {
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
 const mapCategoryNameToId = async (categoryName) => {
  if (!categoryName) {
    throw new Error('Category name is required');
}
  try {
    console.log("Mapping category name to ID:", categoryName);
    const category = await categories.findOne({
      where: { categoryName: categoryName },
    });
    if (category) {
      return category.categoryId;
    } else {
      throw new Error("Category not found");
    }
  } catch (error) {
    console.error("Error mapping category name to ID:", error);
    throw new Error("Error mapping category name to ID: " + error.message);
  }
};




export {
  generateCategoryId,
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  mapCategoryNameToId,
};