import { Op } from "sequelize";
import categories from "../category/category.js";

const createSingleRecord = async (singleRecord) => {
    return await categories.create(singleRecord);
  };


  // const deleteSingleRecord = async (id) => {
  //   const result = await Doctor.destroy({ where: { doctor_id: id } });
  //   return result;
  // };
  
  // const updateMultipleRecords = async (query, updates) =>
  //   await Doctor.update(updates, query);
  
  // const updateRecord = async (condition, dataNeedToUpdate) =>
  //   await Doctor.update(dataNeedToUpdate, condition);
  
  // const findOneById = async (id) => {
  //   return await Doctor.findByPk(id);
  // };
  
  // const findAll = async () => {
  //   return await Doctor.findAll({
  //     order: [["createdAt", "DESC"]],
  //   });
  // };
  
  // const findByQuery = async (query) => {
  //   return await Doctor.findAll({
  //     where: {
  //       [Op.or]: [
  //         { fname: { [Op.iLike]: `%${query}%` } },
  //         { mname: { [Op.iLike]: `%${query}%` } },
  //         { lname: { [Op.iLike]: `%${query}%` } },
  //       ],
  //     },
  //   });
  // };
  
  export default {
    Schema: categories,
    //updateRecord: updateRecord,
    //findOneById,
    //findByQuery,
    //findAll,
    //updateMultipleRecords,
    createSingleRecord,
    //deleteSingleRecord,
  };
  