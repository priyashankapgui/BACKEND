import { getAllSuppliers, getSupplierById, addSupplier , deleteSupplierById, updateSupplierById } from '../supplier/service.js';


export const getSuppliers = async (req, res) => {
  try {
    const suppliersReq = await getAllSuppliers();
    res.status(200).json(suppliersReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  try {
    const supplier = await getSupplierById(supplierId);
    if(!supplier){
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createSupplier = async (req, res) => {
    const supplierData = req.body;
    try {
      console.log('Supplier data received:', supplierData); 
      const newSupplier = await addSupplier(supplierData);
      res.status(201).json(newSupplier);
    } catch (error) {
      console.error('Error creating supplier:', error); 
      res.status(500).json({ error: error.message });
    }
  };
  

export const updateSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  const updatedSupplierData = req.body;
  try {
    const updatedSupplier = await updateSupplierById(supplierId, updatedSupplierData);
    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  try {
    await deleteSupplierById(supplierId);
    res.status(204).json({ message: 'Supplier deleted succesfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
