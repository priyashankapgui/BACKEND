import * as Service from "../supplier/service.js"
import products from "../product/product.js";
import { SUCCESS, ERROR } from "../../helper.js";
import { Codes } from "../supplier/constants.js";

const { SUC_CODES } = Codes;

// Controller function to get all suppliers
export const getSuppliers = async (req, res) => {
try {
  const result = await Service.getAllSuppliers(req.query);
  SUCCESS(res, SUC_CODES, result, req.span);
} catch (err) {
  console.log(err);
  ERROR(res, err, res.span);
}
};

// Controller function to get a specific supplier by supplierID
export const getSupplier = async (req, res) => {
try {
  const result = await Service.getSupplierById(req.params.supplierId);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};



// Controller function  to update an existing supplier
export const updateSupplier = async (req, res) => {
try {
  const result = await Service.updateSupplierById(req.params.supplierId, req.body);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};


// Controller function to delete an existing supplier
export const deleteSupplier = async (req, res) => {

try {
  const result = await Service.deleteSupplierById(req.params.supplierId);

  SUCCESS(res, SUC_CODES, result, req.span);
} catch (error) {
  console.log(error);

  ERROR(res, error, res.span);
}
};


//function to create supplier
export const createSupplier = async (req, res) => {
  try {
    const result = await Service.addSupplier(req.body);
    SUCCESS(res, SUC_CODES, result, req.span);
  } catch (error) {
    ERROR(res, error, res.span);
  }
};












// const addSupplier = async (req, res) => {
//   const { supplierName, regNo, email, address, contactNo, branchName } = req.body;

//   try {
//     // Map branch name to branchId
//     const branchId = await mapBranchNameToId(branchName);

//     // Create new supplier record
//     const newSupplier = await suppliers.create({
//       supplierName,
//       regNo,
//       email,
//       address,
//       contactNo
//     });

//     // Create new record in branch_Supplier table
//     await branchSupplier.create({
//       branchId,
//       supplierId: newSupplier.supplierId
//     });

//     res.status(201).json({ message: 'Supplier added successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default addSupplier;




//Controller function to get a specific supplier by SupplierName
// export const getSupplierBySupplierName = async (req, res) => {
//   const { supplierName } = req.params;
  
//   try {
//     if (!supplierName) {
//       res.status(400).json({ error: "Supplier name is required" });
//       return;
//     }
  
//     const searchResults = await searchSupplierByName(supplierName);
//     res.status(200).json(searchResults);
//   } catch (error) {
//     console.error("Error searching suppliers:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getSupplierBySupplierName = async (req, res) => {
//   const {  branchName, supplierId } = req.query;
//   console.log("branchName",branchName);
//   console.log("product",supplierId);

//   try {
//     // Map branchName to branchId
//     const branchId = await mapBranchNameToId(branchName);

//     if (!branchId) {
//       res.status(404).json({ error: "Branch not found" });
//       return;
//     }

//     // Fetch product by productId and branchId
//     const result= await searchSupplierByName(supplierId, branchId);
//     if (!result) {
//       res.status(404).json({ error: "supplier data not found" });
//       return;
//     }

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// export const getSuppliersByProductId = async (req, res) => {
//   const productId = req.params.productId;

//   try {
//     const supplierDetails = await searchSuppliersByProductId(productId);
//     if (!supplierDetails || supplierDetails.length === 0) {
//       res.status(404).json({ error: "No suppliers found for the given product Name" });
//       return;
//     }
//     res.status(200).json(supplierDetails);
//   } catch (error) {
//     console.error("Error getting suppliers by product Name:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// export const getSuppliersByProductName = async (req, res) => {
//   const { productName } = req.params;

//   try {
//     if (!productName) {
//       return res.status(400).json({ error: "Product name is required" });
//     }
  
//     const product = await products.findOne({
//       where: { productName },
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     const productId = product.productId;
  
//     const suppliersDetails = await searchSuppliersByProductName(productId);
//     if (!suppliersDetails || suppliersDetails.length === 0) {
//       return res.status(404).json({ error: "No suppliers found for the given product name" });
//     }
//     res.status(200).json(suppliersDetails);
//   } catch (error) {
//     console.error("Error fetching suppliers by product name:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Controller function to create a new supplier
// export const createSupplier = async (req, res) => {
//   const supplierData = req.body;
//   try {
//     console.log("Supplier data received:", supplierData);
//     const newSupplier = await addSupplier(supplierData);
//     res.status(201).json(newSupplier);
//   } catch (error) {
//     console.error("Error creating supplier:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
