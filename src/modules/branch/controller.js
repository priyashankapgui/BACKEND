import express from 'express';
import * as BranchServices from './service.js';
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../supplier/constants.js";

const { SUC_CODES } = Codes;

// Function to get all branches
export const getBranches = async (req, res) => {
  try {
    const branchesList = await BranchServices.getAllBranches();
    res.status(200).json(branchesList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
