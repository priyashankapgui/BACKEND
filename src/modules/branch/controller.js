import express from 'express';
import branches from './branch.js'; // Importing the branches model
import jwt from "jsonwebtoken";
import * as BranchServices from './service.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../supplier/constants.js";
const { SUC_CODES } = Codes;
import { SECRET } from "../../../config/config.js";
import { getAllBranches,
        getBranchById,
        createBranch,
        updateBranchById,
        deleteBranchById, 
        getBranchByName,
        getAllBranchesWeb} from './service.js' // Importing service functions to interact with the branches model

const { SECRET_KEY } = SECRET;
// Function to get all branches
export const getBranches = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const role = decoded.userRoleId;
    const branchName = decoded.branchName;
    if (role === 1 && !branchName) {
      const branchesList = await getAllBranches();
      res.status(200).json({branchesList, isSuperAdmin: true});
    }
    else {
      const branchesList = await getBranchByName(branchName);
      res.status(200).json({branchesList: [branchesList], isSuperAdmin: false});
    }
  } 
  catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

export const getBranchesWeb = async (req, res) => {
  try {
    const branchesList = await getAllBranchesWeb();
    res.status(200).json(branchesList);
  } 
  catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}

// Function to get a specific branch by ID
export const getBranch = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const branch = await BranchServices.getBranchById(branchId);
    if (!branch) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to create a new branch
export const createNewBranch = async (req, res) => {
  try {
    const result = await BranchServices.createBranch(req.body);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    ERROR(res, error, req.span);
  }
};

// Function to update a branch by ID
export const updateBranch = async (req, res) => {
  const branchId = req.params.branchId;
  const updatedBranchData = req.body;
  try {
    const updatedBranch = await BranchServices.updateBranchById(branchId, updatedBranchData);
    if (!updatedBranch) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a branch by ID
export const deleteBranch = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const deletedBranch = await BranchServices.deleteBranchById(branchId);
    if (!deletedBranch) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    res.status(204).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
