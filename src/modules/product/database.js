import { Op } from "sequelize";
import products from "../product/product.js";

const createSingleRecord = async (singleRecord) => {
    return await products.create(singleRecord);
  };


//   const deleteSingleRecord = async (categoryId) => {
//     const result = await categories.destroy({ where: { categoryId: categoryId } });
//     return result;
//   };
  
//   const updateMultipleRecords = async (query, updates) =>
//     await categories.update(updates, query);
  
//   const updateRecord = async (condition, dataNeedToUpdate) =>
//     await categories.update(dataNeedToUpdate, condition);
  
//   const findOneById = async (categoryId) => {
//     return await categories.findByPk(categoryId);
//   };
  
//   const findAll = async () => {
//     return await categories.findAll({
//       order: [["createdAt", "DESC"]],
//     });
//   };
  
  
  export default {
//     Schema: categories,
//     updateRecord: updateRecord,
//     findOneById,
//     findAll,
//     updateMultipleRecords,
    createSingleRecord
//     deleteSingleRecord,
  };
  