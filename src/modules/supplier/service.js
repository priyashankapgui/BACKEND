import { Op } from "sequelize";
import { to, TE } from "../../helper.js";
import suppliers from "../supplier/supplier.js";
import categories from "../category/category.js";
import { mapBranchNameToId } from "../../modules/branch/service.js";



//Function to generate supplieId
export const generateSupplierID = async () => {
  try {
    // Fetch the latest supplier ID
    const latestSupplier = await suppliers.findOne({
      order: [['supplierId', 'DESC']],
      attributes: ['supplierId'],
    });

    let newSupplierId;

    if (latestSupplier && latestSupplier.supplierId) {
      // Extract the numeric part of the latest supplier ID and increment it
      const numericPart = parseInt(latestSupplier.supplierId.substring(1), 10);
      const incrementedNumericPart = numericPart + 1;

      // Format the new supplier ID with leading zeros
      newSupplierId = `S${incrementedNumericPart.toString().padStart(4, '0')}`;
    } else {
      // If there are no existing suppliers, start with S0001
      newSupplierId = 'S0001';
    }

    return newSupplierId;
  } catch (error) {
    console.error('Error generating new supplier ID:', error);
    throw new Error('Could not generate new supplier ID');
  }
};





// Function to retrieve all suppliers from the database
export const getAllSuppliers = async () => {
  const getRecords = suppliers.findAll({order: [["createdAt", "DESC"]],});
    const [err, result] = await to(getRecords);
    if (err) TE(err);
    if (!result) TE("Results not found");
    return result;
  };



// Function to retrieve a supplier by its ID
export const getSupplierById = async (supplierId) => {
 
  const getRecord = suppliers.findByPk(supplierId);
  const [err, result] = await to(getRecord);
  if (err) TE(err);
  if (!result) TE("Result not found");
  return result;
  };




//function to create supplier
export const addSupplier = async (data) => {
 
  const supplierId = await generateSupplierID();
  console.log("supplierId",supplierId);

  const createSingleRecord = suppliers.create({ supplierId, ...data });

  const [err, result] = await to (createSingleRecord);

  if (err) TE(err.errors[0] ? err.errors[0].message : err);

if (!result) TE("Result not found");

return result;

};




// Function to update a supplier by its ID
export const updateSupplierById = async (supplierId, updatedSupplierData) => {
  const updateRecord = suppliers.update(updatedSupplierData, {
    where: { supplierId: supplierId },
    returning: true, // Ensure it returns the updated record
    plain: true
  });

  const [err, result] = await to(updateRecord);
  if (err) TE(err);
  if (!result) TE("Result not found");
  
  // Fetch the updated record to return
  const updatedRecord = await suppliers.findByPk(supplierId);
  if (!updatedRecord) TE("Updated result not found");

  return updatedRecord;
};


// Function to delete a supplier by its ID
export const deleteSupplierById = async (supplierId) => {
  const deleteRecord = suppliers.destroy({ where: { supplierId: supplierId } });

  const [err, result] = await to(deleteRecord);
  if (err) TE(err);
  if (result === 0) TE("Supplier not found or already deleted");

  return { message: 'Supplier successfully deleted' };
};



//function to map supplierId into supplierName
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

// export const searchSupplierByName = async (supplierId, branchId) => {
//   try {

//     const branchSupplierdata = await branchSupplier.findOne({
//       where: { branchId },
//     });

//     if (!branchSupplierdata) {
//       throw new Error("Supplier not found for the branch");
//     }

//     const supplierdata = await suppliers.findOne({
//       where: { supplierId: branchSupplierdata.supplierId },
//     });

//     if (!supplierdata) {
//       throw new Error("Supplier not found");
//     }


//     // Extract product details from the product GRNs
//     const result = {
//       supplierId: supplierdata.supplierId,
//       supplierName: supplierdata.supplierName,
//       regNo: supplierdata.regNo,
//       email: supplierdata.email,
//       address: supplierdata.address,
//       contactNo: supplierdata.contactNo,
      
//     };

//     return result;
//   } catch (error) {
//     throw new Error("Error retrieving product details: " + error.message);
//   }
// };



// export const searchSuppliersByProductId = async (productId) => {
//   try {
//     const supplierDetails = await productSupplier.findAll({
//       where: { productId },
//       include: [{ model: suppliers, attributes: ['branchName', 'supplierId', 'supplierName', 'regNo', 'email', 'address', 'contactNo'] }]
//     });
//     return supplierDetails;
//   } catch (error) {
//     console.error("Error searching suppliers by product ID:", error);
//     throw new Error("Error getting suppliers by product ID");
//   }
// };

// export const searchSuppliersByProductName = async (productId) => {
//   try {
//     // Query the productSupplier model to find suppliers for the given productId
//     const suppliersDetails = await productSupplier.findAll({
//       where: { productId },
//       include: [{ model: suppliers, attributes: ['branchName', 'supplierId', 'supplierName', 'regNo', 'email', 'address', 'contactNo'] }]
//     });

//     return suppliersDetails;
//   } catch (error) {
//     // Log and throw any errors that occur during the process
//     console.error("Error searching suppliers by product ID:", error);
//     throw new Error("Error getting suppliers by product ID");
//   }
// };








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