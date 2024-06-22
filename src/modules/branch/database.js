import { Op } from "sequelize";
import branches from "../branch/branch.js";

// Function to create a single branch record
const createSingleRecord = async (singleRecord) => {
  return await branches.create(singleRecord);
};

// Exporting the branch schema and the create function
export default {
  Schema: branches,
  createSingleRecord,
};
