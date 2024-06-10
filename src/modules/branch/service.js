import branches from '../branch/branch.js'

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
    throw new Error('Could not generate new branch ID');
  }
}



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

export const getBranchById = async (branchId) => {
    try {
        const branchbyId = await branches.findByPk(branchId);
        return branchbyId;
    } catch (error) {
        throw new Error('Error fetching branch: ' + error.message);
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

export const createBranch = async (branchData) => {
  try {
    const branchId = await generateBranchId();
    
    // Ensure branchData includes the generated branchId
    const newBranch = await branches.create({ branchId, ...branchData });
    return newBranch;
  } catch (error) {
    throw new Error('Error creating branch: ' + error.message);
  }
};

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


  export const mapBranchNameToId = async (branchName) => {
    try {
      console.log("Mapping branch name to ID:", branchName);
      const branch = await branches.findOne({
        where: { branchName: branchName },
      });
      if (branch) {
        return branch.branchId;
      } else {
        throw new Error("Branch not found");
      }
    } catch (error) {
      console.error("Error mapping branch name to ID:", error);
      throw new Error("Error mapping branch name to ID: " + error.message);
    }
  };
  