import { Op } from "sequelize";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";
import { mapBranchNameToId } from "../../modules/branch/service.js";
import branchSupplier from "../branch_Supplier/branch_Supplier.js";

//import products from "../product/product.js";
//import productSupplier from "../product_Supplier/product_Supplier.js";

// Function to retrieve all suppliers from the database
export const getAllSuppliers = async () => {
  try {
    const suppliersReq = await suppliers.findAll();
    return suppliersReq;
  } catch (error) {
    throw new Error("Error retrieving suppliers: " + error.message);
  }
};

// Function to retrieve a supplier by its ID
export const getSupplierById = async (supplierId) => {
  try {
    const supplier = await suppliers.findByPk(supplierId);
    return supplier;
  } catch (error) {
    throw new Error("Error fetching supplier: " + error.message);
  }
};

// Function to retrieve a supplier by its supplierName
// export const searchSupplierByName = async (supplierName) => {
//   try {
//     const searchResults = await suppliers.findAll({
//       where: {
//         supplierName: {
//           [Op.like]: `%${supplierName}%`, // Using Sequelize's like operator to search for partial matches
//         },
//       },
//     });
//     return searchResults;
//   } catch (error) {
//     console.error("Error searching suppliers:", error);
//     throw new Error("Error searching suppliers");
//   }
// };

export const searchSupplierByName = async (supplierId, branchId) => {
  try {

    const branchSupplierdata = await branchSupplier.findOne({
      where: { branchId },
    });

    if (!branchSupplierdata) {
      throw new Error("Supplier not found for the branch");
    }

    const supplierdata = await suppliers.findOne({
      where: { supplierId: branchSupplierdata.supplierId },
    });

    if (!supplierdata) {
      throw new Error("Supplier not found");
    }


    // Extract product details from the product GRNs
    const result = {
      supplierId: supplierdata.supplierId,
      supplierName: supplierdata.supplierName,
      regNo: supplierdata.regNo,
      email: supplierdata.email,
      address: supplierdata.address,
      contactNo: supplierdata.contactNo,
      
    };

    return result;
  } catch (error) {
    throw new Error("Error retrieving product details: " + error.message);
  }
};



export const searchSuppliersByProductId = async (productId) => {
  try {
    const supplierDetails = await productSupplier.findAll({
      where: { productId },
      include: [{ model: suppliers, attributes: ['branchName', 'supplierId', 'supplierName', 'regNo', 'email', 'address', 'contactNo'] }]
    });
    return supplierDetails;
  } catch (error) {
    console.error("Error searching suppliers by product ID:", error);
    throw new Error("Error getting suppliers by product ID");
  }
};

export const searchSuppliersByProductName = async (productId) => {
  try {
    // Query the productSupplier model to find suppliers for the given productId
    const suppliersDetails = await productSupplier.findAll({
      where: { productId },
      include: [{ model: suppliers, attributes: ['branchName', 'supplierId', 'supplierName', 'regNo', 'email', 'address', 'contactNo'] }]
    });

    return suppliersDetails;
  } catch (error) {
    // Log and throw any errors that occur during the process
    console.error("Error searching suppliers by product ID:", error);
    throw new Error("Error getting suppliers by product ID");
  }
};



// Function to update a supplier by its ID
export const updateSupplierById = async (supplierId, updatedSupplierData) => {
  try {
    const supplier = await suppliers.findByPk(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    await supplier.update(updatedSupplierData);
    return supplier;
  } catch (error) {
    throw new Error("Error updating supplier: " + error.message);
  }
};

// Function to delete a supplier by its ID
export const deleteSupplierById = async (supplierId) => {
  try {
    const supplier = await suppliers.findByPk(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    await supplier.destroy();
    return { message: "Supplier deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting supplier: " + error.message);
  }
};


export const mapSupplierNameToId = async (supplierName) => {
  try {
    console.log("Mapping supplier name to ID:", supplierName);
    const supplier = await suppliers.findOne({
      where: { supplierName: supplierName },
    });
    if (supplier) {
      return supplier.supplierId;
    } else {
      throw new Error("Supplier not found");
    }
  } catch (error) {
    console.error("Error mapping supplier name to ID:", error);
    throw new Error("Error mapping supplier name to ID: " + error.message);
  }
};


export const addSupplier = async (supplierName, regNo, email, address, contactNo, branchName) => {
  try {
    // Map branch name to branchId
    const branchId = await mapBranchNameToId(branchName);
    

    // Create new supplier record
    const newSupplier = await suppliers.create({
      supplierName,
      regNo,
      email,
      address,
      contactNo
    });

    // Create new record in branch_Supplier table
    await branchSupplier.create({
      branchId,
      supplierId: newSupplier.supplierId
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
















// Function to add a new supplier to the database
// export const addSupplier = async (supplierData) => {
//   try {
//     const newSupplier = await suppliers.create(supplierData);
//     if(email)
//     return newSupplier;
//   } catch (error) {
//     throw new Error("Error creating supplier: " + error.message);
//   }
// };