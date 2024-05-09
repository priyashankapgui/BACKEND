import branchSupplier from "../branch_Supplier/branch_Supplier.js";


export const createBranchSupplierService = async ({
  branchId,
  supplierId,
}) => {
  try {
    const newBranchSupplier = await branchSupplier.create({
      branchId,
      supplierId,
    });
    return newBranchSupplier;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Error creating product supplier: " + error.message);
    }
  }
}; 