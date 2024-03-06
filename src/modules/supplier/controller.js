import Supplier from './supplier.js';

// GET all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single supplier by ID
export const getSupplierById = async (req, res) => {
  const supplierId = req.params.id;
  try {
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create a new supplier
export const createSupplier = async (req, res) => {
  const supplierData = req.body;
  try {
    const newSupplier = await Supplier.create(supplierData);
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update a supplier by ID
export const updateSupplier = async (req, res) => {
  const supplierId = req.params.id;
  const supplierData = req.body;
  try {
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    await supplier.update(supplierData);
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a supplier by ID
export const deleteSupplier = async (req, res) => {
  const supplierId = req.params.id;
  try {
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    await supplier.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
