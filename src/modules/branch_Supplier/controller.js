import { createBranchSupplierService } from "../branch_Supplier/service.js";

export const createBranchSupplier = async (req, res) => {
  try{

    const { branchId, supplierId } = req.body;
    const newBranchSupplier = await createBranchSupplierService({
      branchId,
      supplierId,
    });
    res.status(201).json(newBranchSupplier);
  } catch (error) {
    console.error("Error creating product GRN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
