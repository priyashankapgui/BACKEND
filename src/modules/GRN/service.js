import { v4 as uuidv4 } from 'uuid';
import { to, TE } from "../../helper.js";
import products from "../product/product.js";
import grn from "../GRN/grn.js";
import suppliers from "../supplier/supplier.js";
import { mapSupplierNameToId } from "../../modules/supplier/service.js"; 
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




// Function to get all GRNs
export const getAllGRNs = async () => {
  const getAllGRNs = grn.findAll();
  const [err, grnAll] = await to(getAllGRNs);
  if (err) TE(err);
  if (!grnAll) TE("No GRNs found");

  const resultPromises = grnAll.map(async (grnItem) => {
    const getSupplier = suppliers.findOne({
      where: { supplierId: grnItem.supplierId },
    });
    const [supplierErr, supplier] = await to(getSupplier);
    if (supplierErr) TE(supplierErr);
    if (!supplier) TE("Supplier not found for GRN_NO: " + grnItem.GRN_NO);

    const getBranch = branches.findOne({
      where: { branchId: grnItem.branchId },
    });
    const [branchErr, branch] = await to(getBranch);
    if (branchErr) TE(branchErr);
    if (!branch) TE("Branch not found for GRN_NO: " + grnItem.GRN_NO);

    return {
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt,
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
    };
  });

  const [resultErr, result] = await to(Promise.all(resultPromises));
  if (resultErr) TE(resultErr);
  if (!result) TE("Results not found");

  return result;
};




// Function to get GRN by GRN_NO
export const getGRNById = async (GRN_NO) => {
  const getGRN = grn.findOne({
    where: { GRN_NO },
  });
  const [err, grnItem] = await to(getGRN);
  if (err) TE(err);
  if (!grnItem) TE("GRN not found");

  const getSupplier = suppliers.findOne({
    where: { supplierId: grnItem.supplierId },
  });
  const [supplierErr, supplier] = await to(getSupplier);
  if (supplierErr) TE(supplierErr);
  if (!supplier) TE("Supplier not found for GRN_NO: " + GRN_NO);

  const getBranch = branches.findOne({
    where: { branchId: grnItem.branchId },
  });
  const [branchErr, branch] = await to(getBranch);
  if (branchErr) TE(branchErr);
  if (!branch) TE("Branch not found for GRN_NO: " + GRN_NO);

  const result = {
    GRN_NO: grnItem.GRN_NO,
    createdAt: grnItem.createdAt,
    branchName: branch.branchName,
    supplierName: supplier.supplierName,
    invoiceNo: grnItem.invoiceNo,
  };

  return result;
};




// Function to get GRNs by invoice number
export const getGRNByInvoiceNo = async (invoiceNo) => {
  const getGRN = grn.findOne({
    where: { invoiceNo },
  });
  const [err, grnItem] = await to(getGRN);
  if (err) TE(err);
  if (!grnItem) TE("GRN not found");

  const getSupplier = suppliers.findOne({
    where: { supplierId: grnItem.supplierId },
  });
  const [supplierErr, supplier] = await to(getSupplier);
  if (supplierErr) TE(supplierErr);
  if (!supplier) TE("Supplier not found for GRN_NO: " + grnItem.GRN_NO);

  const getBranch = branches.findOne({
    where: { branchId: grnItem.branchId },
  });
  const [branchErr, branch] = await to(getBranch);
  if (branchErr) TE(branchErr);
  if (!branch) TE("Branch not found for GRN_NO: " + grnItem.GRN_NO);

  const result = {
    GRN_NO: grnItem.GRN_NO,
    createdAt: grnItem.createdAt,
    branchName: branch.branchName,
    supplierName: supplier.supplierName,
    invoiceNo: grnItem.invoiceNo,
  };

  return result;
};



// Function to get GRNs by date range
export const getGRNsByDateRange = async (startDate, endDate) => {
  const getGRNs = grn.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: suppliers,
        as: 'supplier',
        attributes: ['supplierName'],
      },
      {
        model: branches,
        as: 'branch',
        attributes: ['branchName'],
      },
    ],
  });

  const [err, grns] = await to(getGRNs);
  if (err) TE(err);
  if (!grns) TE("No GRNs found in the specified date range");

  const result = grns.map((grnItem) => ({
    GRN_NO: grnItem.GRN_NO,
    createdAt: grnItem.createdAt,
    branchName: grnItem.branch.branchName,
    supplierName: grnItem.supplier.supplierName,
    invoiceNo: grnItem.invoiceNo,
  }));

  return result;
};



// Function to query GRN data by supplierId
export const getGRNBySupplierId = async (supplierId) => {
  const getGRNs = grn.findAll({
    where: { supplierId },
  });

  const [err, grnItems] = await to(getGRNs);
  if (err) TE(err);
  if (!grnItems || grnItems.length === 0) TE("No GRNs found for this supplier");

  const getSupplier = suppliers.findOne({
    where: { supplierId },
  });

  const [supplierErr, supplier] = await to(getSupplier);
  if (supplierErr) TE(supplierErr);
  if (!supplier) TE("Supplier not found for supplierId: " + supplierId);

  const resultPromises = grnItems.map(async (grnItem) => {
    const getBranch = branches.findOne({
      where: { branchId: grnItem.branchId },
    });

    const [branchErr, branch] = await to(getBranch);
    if (branchErr) TE(branchErr);
    if (!branch) TE("Branch not found for GRN_NO: " + grnItem.GRN_NO);

    return {
      GRN_NO: grnItem.GRN_NO,
      createdAt: grnItem.createdAt,
      branchName: branch.branchName,
      supplierName: supplier.supplierName,
      invoiceNo: grnItem.invoiceNo,
    };
  });

  const [resultErr, results] = await to(Promise.all(resultPromises));
  if (resultErr) TE(resultErr);

  return results;
};




// Function to get GRN by branchId
// export const getGRNByBranchId = async (branchName) => {

//   try {
//     // Find the branch first to get the branchId
//     const branch = await branches.findOne({
//       where: { branchName },
//       attributes: ['branchId'],
//       raw: true,
//     });

//     console.log("branch", branch);

//     if (!branch) {
//       throw new Error(`Branch not found for branchName: ${branchName}`);
//     }

//     const branchId = branch.branchId;
//     console.log("branchId", branchId);


//   const getGRNs = grn.findAll({
//     where: { branchId },
//     attributes: ['GRN_NO', 'createdAt', 'supplierId', 'invoiceNo'],
//     raw: true,
//   });

//   const [err, grnItems] = await to(getGRNs);
//   if (err) TE(err);
//   if (!grnItems || grnItems.length === 0) TE(`No GRNs found for branchId: ${branchId}`);

//   const resultPromises = grnItems.map(async (grnItem) => {
//     const { GRN_NO, supplierId } = grnItem;

//     const getSupplier = suppliers.findOne({
//       where: { supplierId },
//       attributes: ['supplierName'],
//       raw: true,
//     });

//     const [supplierErr, supplier] = await to(getSupplier);
//     if (supplierErr) TE(supplierErr);
//     if (!supplier) TE(`Supplier not found for supplierId: ${supplierId}`);

//     const getBranch = branches.findOne({
//       where: { branchId },
//       attributes: ['branchName'],
//       raw: true,
//     });

//     const [branchErr, branch] = await to(getBranch);
//     if (branchErr) TE(branchErr);
//     if (!branch) TE(`Branch not found for branchId: ${branchId}`);

//     return {
//       GRN_NO,
//       createdAt: grnItem.createdAt,
//       branchName: branch.branchName,
//       supplierName: supplier.supplierName,
//       invoiceNo: grnItem.invoiceNo,
//     };
//   });

//   const [resultErr, results] = await to(Promise.all(resultPromises));
//   if (resultErr) TE(resultErr);


//   return results;


// };


// Function to get GRN by branchId
export const getGRNByBranchId = async (branchName) => {
  try {
    const branch = await branches.findOne({
      where: { branchName },
      attributes: ['branchId'],
      raw: true,
    });

    console.log("branch", branch);

    if (!branch) {
      throw new Error(`Branch not found for branchName: ${branchName}`);
    }

    const branchId = branch.branchId;
    console.log("branchId", branchId);

    const grnItems = await grn.findAll({
      where: { branchId },
      attributes: ['GRN_NO', 'createdAt', 'supplierId', 'invoiceNo'],
      raw: true,
    });

    if (!grnItems || grnItems.length === 0) {
      throw new Error(`No GRNs found for branchId: ${branchId}`);
    }

    const resultPromises = grnItems.map(async (grnItem) => {
      const { GRN_NO, supplierId } = grnItem;

      const supplier = await suppliers.findOne({
        where: { supplierId },
        attributes: ['supplierName'],
        raw: true,
      });

      if (!supplier) {
        throw new Error(`Supplier not found for supplierId: ${supplierId}`);
      }

      return {
        GRN_NO,
        createdAt: grnItem.createdAt,
        branchName: branchName, 
        supplierName: supplier.supplierName,
        invoiceNo: grnItem.invoiceNo,
      };
    });

    const results = await Promise.all(resultPromises);

    return results;
  } catch (error) {
    throw error;
  }
};







// Function to get GRN data by branchName and supplierId
export const getGRNsByBranchAndSupplier = async (branchName, supplierId) => {
  const getBranch = branches.findOne({
    where: { branchName }
  });

  const [branchErr, branch] = await to(getBranch);
  if (branchErr) TE(branchErr);
  if (!branch) TE('Branch not found for branchName: ' + branchName);

  const getSupplier = suppliers.findOne({
    where: { supplierId }
  });

  const [supplierErr, supplier] = await to(getSupplier);
  if (supplierErr) TE(supplierErr);
  if (!supplier) TE('Supplier not found for supplierId: ' + supplierId);

  const getGRNs = grn.findAll({
    where: {
      branchId: branch.branchId,
      supplierId: supplier.supplierId
    }
  });

  const [grnErr, grnItems] = await to(getGRNs);
  if (grnErr) TE(grnErr);
  if (!grnItems || grnItems.length === 0) TE('No GRNs found for this branch and supplier');

  const results = grnItems.map(grnItem => ({
    GRN_NO: grnItem.GRN_NO,
    createdAt: grnItem.createdAt,
    branchName: branch.branchName,
    supplierName: supplier.supplierName,
    invoiceNo: grnItem.invoiceNo,
  }));

  return results;
};




























