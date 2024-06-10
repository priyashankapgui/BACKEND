import { Op } from "sequelize";
import { to, TE } from "../../helper.js";
import sequelize from "../../../config/database.js";
import branches from "../branch/branch.js";
import database from "./database.js";

// Function to generate branchId
export const generateBranchId = async () => {
  try {
    // Fetch the latest branch ID
    const latestBranch = await branches.findOne({
      order: [['branchId', 'DESC']],
      attributes: ['branchId'],
    });

    let newBranchId;

    if (latestBranch && latestBranch.branchId) {
      // Extract the numeric part of the latest branch ID and increment it
      const numericPart = parseInt(latestBranch.branchId.substring(1), 10);
      const incrementedNumericPart = numericPart + 1;

      // Format the new branch ID with leading zeros
      newBranchId = `B${incrementedNumericPart.toString().padStart(4, '0')}`;
    } else {
      // If there are no existing branches, start with B0001
      newBranchId = 'B0001';
    }

    return newBranchId;
  } catch (error) {
    console.error('Error generating new branch ID:', error);
    TE('Could not generate new branch ID');
  }
};

// Function to retrieve all branches from the database
export const getAllBranches = async () => {
  const [err, branchReq] = await to(branches.findAll());
  if (err) TE("Error retrieving branches: " + err.message);
  return branchReq;
};

export const getAllBranchesWeb = async () => {
    try{
        const branchReq = await branches.findAll({
            attributes: ['branchId', 'branchName']
        });
        return branchReq;
    }catch (error) {
        console.error('Error retrieving branches:', error);
        throw new Error('Error retrieving branches');
    }
};

export const getBranchByName = async (branchName) => {
  try {
    const branch = await branches.findOne({
      where: { branchName: branchName },
    });
    return branch;
  } catch (error) {
    throw new Error('Error fetching branch: ' + error.message);
  }
};

// Function to retrieve a branch by its ID
export const getBranchById = async (branchId) => {
  const [err, branchById] = await to(branches.findByPk(branchId));
  if (err) TE("Error fetching branch: " + err.message);
  if (!branchById) TE("Branch not found");
  return branchById;
};

// Function to create a new branch
export const createBranch = async (branchData) => {
  const branchId = await generateBranchId();
  console.log("Generated branchId:", branchId);

  const createSingleRecord = database.createSingleRecord({ branchId, ...branchData });
  const [err, result] = await to(createSingleRecord);

  if (err) TE(err.errors[0] ? err.errors[0].message : err);
  if (!result) TE("Branch creation failed");

  return result;
};

// Function to update a branch by its ID
export const updateBranchById = async (branchId, branchData) => {
  const [err, branch] = await to(branches.findByPk(branchId));
  if (err) TE("Error fetching branch: " + err.message);
  if (!branch) TE("Branch not found");

  const [updateErr] = await to(branch.update(branchData));
  if (updateErr) TE("Error updating branch: " + updateErr.message);

  return branch;
};

// Function to delete a branch by its ID
export const deleteBranchById = async (branchId) => {
  const [err, branch] = await to(branches.findByPk(branchId));
  if (err) TE("Error fetching branch: " + err.message);
  if (!branch) TE("Branch not found");

  const [deleteErr] = await to(branch.destroy());
  if (deleteErr) TE("Error deleting branch: " + deleteErr.message);

  return { message: "Branch deleted successfully" };
};

// Function to map branch name to ID
export const mapBranchNameToId = async (branchName) => {
  const [err, branch] = await to(
    branches.findOne({
      where: { branchName: branchName },
    })
  );
  if (err) TE("Error mapping branch name to ID: " + err.message);
  if (!branch) TE("Branch not found");

  return branch.branchId;
};
