import { to, TE } from "../../helper.js";
import categories from "../category/category.js";
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
 const getAllCategories = async (params) => {

    const getRecords = categories.findAll({order: [["createdAt", "DESC"]],});
    const [err, result] = await to(getRecords);
    if (err) TE(err);
    if (!result) TE("Results not found");
    return result;
  };



// Function to get a category by its ID
 const getCategoryById = async (categoryId) => {
 
const getRecord = categories.findByPk(categoryId);
const [err, result] = await to(getRecord);
if (err) TE(err);
if (!result) TE("Result not found");
return result;
};



// Function to add a new category
 const addCategory = async (data) => {
  
    const categoryId = await generateCategoryId();
    const createSingleRecord = categories.create({ categoryId, ...data });
    const [err, result] = await to (createSingleRecord);

  if (err) TE(err.errors[0] ? err.errors[0].message : err);
  if (!result) TE("Result not found");
  return result;
};


//Function to update category
const updateCategoryById = async (categoryId, updatedCategoryData) => {
  const updateRecord = categories.update(updatedCategoryData, {
    where: { categoryId: categoryId },
    returning: true, // Ensure it returns the updated record
    plain: true
  });

  const [err, result] = await to(updateRecord);
  if (err) TE(err);
  if (!result) TE("Result not found");
  
  // Fetch the updated record to return
  const updatedRecord = await categories.findByPk(categoryId);
  if (!updatedRecord) TE("Updated result not found");

  return updatedRecord;
};





// Function to delete a category by its ID
const deleteCategoryById = async (categoryId) => {
  const deleteRecord = categories.destroy({ where: { categoryId: categoryId } });

  const [err, result] = await to(deleteRecord);
  if (err) TE(err);
  if (result === 0) TE("Category not found or already deleted");

  return { message: 'Category successfully deleted' };
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




export  {
  generateCategoryId,
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  mapCategoryNameToId,
};






// Function to update a category by its ID
//  const updateCategoryById = async (categoryId, updatedCategoryData) => {
  
//     const category = await categories.findByPk(categoryId);
//     if (!category) {
//       return null;
//     }
//     const updatedData = await categories.update(updatedCategoryData, {
//       where: { categoryId: categoryId } // Adding the where clause
//     });
// // const updateRecord = categories.update(
// //   { where: { categoryId: categoryId } },
// //   updatedCategoryData
// // );

// const [err, result] = await to(updatedData);

// if (err) TE(err.errors[0] ? err.errors[0].message : err);

// if (!result) TE("Result not found");

// return updatedData;
// };