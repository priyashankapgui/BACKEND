import { to, TE } from "../../helper.js";
import categories from "../category/category.js";

const generateCategoryId = async () => {
  try {
    // Fetch the latest category ID
    const latestCategory = await categories.findOne({
      order: [["categoryId", "DESC"]],
      attributes: ["categoryId"],
    });
    let newCategoryId;
    if (latestCategory && latestCategory.categoryId) {
      const numericPart = parseInt(latestCategory.categoryId.substring(3), 10);
      const incrementedNumericPart = numericPart + 1;
      newCategoryId = `CAT${incrementedNumericPart
        .toString()
        .padStart(5, "0")}`;
    } else {
      newCategoryId = "CAT00001";
    }
    return newCategoryId;
  } catch (error) {
    console.error("Error generating new category ID:", error);
    throw new Error("Could not generate new category ID");
  }
};

// Function to get all categories
const getAllCategories = async (params) => {
  const getRecords = categories.findAll({ order: [["createdAt", "DESC"]] });
  const [err, result] = await to(getRecords);
  if (err) TE(err);
  if (!result) TE("Results not found");
  return result;
};

// Function to get a category by its ID
const getCategoryById = async (categoryId) => {
  const getRecord = categories.findByPk(categoryId);
  const [err, category] = await to(getRecord);
  if (err) TE(err);
  if (!category) TE("Result not found");
  const result = {
    categoryName: category.categoryName,
    image: category.image,
  };
  return result;
};

// // Function to add a new category
const addCategory = async ({ categoryName, image }) => {
  try {
    const categoryId = await generateCategoryId();
    const category = await categories.create({
      categoryId,
      categoryName,
      image,
    });
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Function to update category
const updateCategoryById = async (categoryId, updatedCategoryData) => {
  const [err, result] = await to(
    categories.update(updatedCategoryData, {
      where: { categoryId: categoryId },
      returning: true,
      plain: true,
    })
  );

  if (err) TE(err);
  if (!result) TE("Result not found");

  const updatedRecord = await categories.findByPk(categoryId);
  if (!updatedRecord) TE("Updated result not found");

  return updatedRecord;
};

// Function to delete a category by its ID
const deleteCategoryById = async (categoryId) => {
  const deleteRecord = categories.destroy({
    where: { categoryId: categoryId },
  });

  const [err, result] = await to(deleteRecord);
  if (err) TE(err);
  if (result === 0) TE("Category not found or already deleted");

  return { message: "Category successfully deleted" };
};

// Function to map a category name to its ID
const mapCategoryNameToId = async (categoryName) => {
  if (!categoryName) {
    throw new Error("Category name is required");
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
