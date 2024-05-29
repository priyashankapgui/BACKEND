// Importing required modules
import express from 'express';
import branches from './branch.js'; // Importing the branches model
import { getAllBranches,
        getBranchById,
        createBranch,
        updateBranchById,
        deleteBranchById } from './service.js' // Importing service functions to interact with the branches model

// Function to get all branches
export const getBranches = async (req, res) => {
  try {
    const branchesList = await getAllBranches(); 
    res.status(200).json(branchesList);  
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// Function to get a specific branch by ID
export const getBranch = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const branch = await getBranchById(branchId);
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
  const branchData = req.body;
  try {
    const newBranch = await createBranch(branchData);
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update a branch by ID 
export const updateBranch = async (req, res) => {
  const branchId = req.params.branchId;
  const updatedBranchData = req.body;
  try {
    const updatedBranch = await updateBranchById(branchId, updatedBranchData);
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
    const deletedBranch = await deleteBranchById(branchId);
    if (!deletedBranch) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};