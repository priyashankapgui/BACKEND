import { to, TE } from "../../helper.js";
import grn from "../GRN/grn.js";
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branches from "../branch/branch.js";
import productGRN from '../product_GRN/product_GRN.js';
import { Op } from 'sequelize';



// Function to generate GRN number
const generateGRNNumber = async (branchName) => {
  try {
    if (!branchName || typeof branchName !== 'string') {
      throw new Error("Invalid branchName: " + branchName);
    }
    const branchCode = branchName.substring(0, 3).toUpperCase();
    const lastGRN = await getLastBranchGRNNumber(branchCode);
    let lastNumber = 0; 

    if (lastGRN) {
      lastNumber = parseInt(lastGRN.split('GRN')[1]); 
      if (isNaN(lastNumber)) {
        throw new Error("Invalid GRN number format");
      }
    }

    lastNumber++;

    const paddedNumber = lastNumber.toString().padStart(5, '0');

    const GRN_NO = `${branchCode}-GRN${paddedNumber}`;

    return GRN_NO;
  } catch (error) {
    throw new Error("Error generating GRN number: " + error.message);
  }
};

// Function to get the last GRN number for a specific branch from the database
const getLastBranchGRNNumber = async (branchCode) => {
  try {

    const latestGRN = await grn.findOne({
      where: {
        GRN_NO: {
          [Op.startsWith]: `${branchCode}-GRN`
        }
      },
      order: [['createdAt', 'DESC']] 
    });

    return latestGRN ? latestGRN.GRN_NO : null; 

  } catch (error) {
    throw new Error("Error getting last GRN number for branch: " + error.message);
  }
};




//Function to create GRN 
export const addGRN = async (invoiceNo, supplierId, branchName) => {
  try {
    const GRN_NO = await generateGRNNumber(branchName); 

    const branchId = await mapBranchNameToId(branchName);

    if (!branchId) {
      res.status(404).json({ error: "Branch not found" });
      return;
    }

    const grndata = await grn.create({
      invoiceNo,
      supplierId,
      branchId,
      GRN_NO,
    });

    return grndata;
  } catch (error) {
    throw new Error('Error creating GRN entry: ' + error.message);
  }
};
















