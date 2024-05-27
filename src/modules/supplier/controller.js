import {
  getAllSuppliers,
  getSupplierById,
  searchSupplierByName,
  searchSuppliersByProductId,
  searchSuppliersByProductName,
  addSupplier,
  deleteSupplierById,
  updateSupplierById,
} from "../supplier/service.js";
import products from "../product/product.js";

// Controller function to get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliersReq = await getAllSuppliers();
    res.status(200).json(suppliersReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get a specific supplier by supplierID
export const getSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  try {
    const supplier = await getSupplierById(supplierId);
    if (!supplier) {
      res.status(404).json({ error: "Supplier not found" });
      return;
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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

export const getSupplierBySupplierName = async (req, res) => {
  const {  branchName, supplierId } = req.query;
  console.log("branchName",branchName);
  console.log("product",supplierId);

  try {
    // Map branchName to branchId
    const branchId = await mapBranchNameToId(branchName);

    if (!branchId) {
      res.status(404).json({ error: "Branch not found" });
      return;
    }

    // Fetch product by productId and branchId
    const result= await searchSupplierByName(supplierId, branchId);
    if (!result) {
      res.status(404).json({ error: "supplier data not found" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getSuppliersByProductId = async (req, res) => {
  const productId = req.params.productId;

  try {
    const supplierDetails = await searchSuppliersByProductId(productId);
    if (!supplierDetails || supplierDetails.length === 0) {
      res.status(404).json({ error: "No suppliers found for the given product Name" });
      return;
    }
    res.status(200).json(supplierDetails);
  } catch (error) {
    console.error("Error getting suppliers by product Name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getSuppliersByProductName = async (req, res) => {
  const { productName } = req.params;

  try {
    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }
  
    const product = await products.findOne({
      where: { productName },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productId = product.productId;
  
    const suppliersDetails = await searchSuppliersByProductName(productId);
    if (!suppliersDetails || suppliersDetails.length === 0) {
      return res.status(404).json({ error: "No suppliers found for the given product name" });
    }
    res.status(200).json(suppliersDetails);
  } catch (error) {
    console.error("Error fetching suppliers by product name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

// Controller function  to update an existing supplier
export const updateSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  const updatedSupplierData = req.body;
  try {
    const updatedSupplier = await updateSupplierById(
      supplierId,
      updatedSupplierData
    );
    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to delete an existing supplier
export const deleteSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  try {
    await deleteSupplierById(supplierId);
    res.status(204).json({ message: "Supplier deleted succesfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const createSupplier = async (req, res) => {
  const { supplierName, regNo, email, address, contactNo, branchName } = req.body;

  try {
    // Call service function to add supplier
    await addSupplier(supplierName, regNo, email, address, contactNo, branchName);
    
    res.status(201).json({ message: 'Supplier added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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