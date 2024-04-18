// Importing the branches model
import branches from '../branch/branch.js'

// Function to get all branches
export const getAllBranches = async () => {
    try{
        const branchReq = await branches.findAll();
        console.log(branchReq);
        return branchReq;
    }catch (error) {
        console.error('Error retrieving branches:', error);
        throw new Error('Error retrieving branches');
    }
};

// Function to get a branch by ID
export const getBranchById = async (branchId) => {
    try {
        const branchbyId = await branches.findByPk(branchId);
        return branchbyId;
    } catch (error) {
        throw new Error('Error fetching branch: ' + error.message);
    }
};

// Function to create a new branch
export const createBranch = async (Branch) => {
    try {
      const newBranch = await branches.create(Branch);
      return newBranch;
    } catch (error) {
      throw new Error('Error creating branch: ' + error.message);
    }
};

// Function to update a branch by ID
export const updateBranchById = async (branchId, branchData) => {
  try {
    const branch = await branches.findByPk(branchId);
    if (!branch) {
      return null;
    }
    const updatedBranch = await branches.update(branchData, {
      where: { branchId: branchId } // Adding the where clause
    });
    return updatedBranch;
  } catch (error) {
    throw new Error('Error updating branch: ' + error.message);
  }
};

// Function to delete a branch by ID
export const deleteBranchById = async (branchId) => {
    try {
      const branch = await branches.findByPk(branchId);
      if (!branch) {
        throw new Error('Product not found');
      }
      await branch.destroy();
      return { message: 'Branch deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting branch: ' + error.message);
    }
  };