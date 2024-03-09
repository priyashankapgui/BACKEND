import sequelize from '../../../config/database.js';
import suppliers from '../supplier/supplier.js';


export const getAllSuppliers = async () => {
  try {
    const suppliersReq = await suppliers.findAll();
    return suppliersReq;
  } catch (error) {
    throw new Error('Error retrieving suppliers: ' + error.message);
  }
};


export const getSupplierById = async (supplierId) => {
  try {
    const supplier = await suppliers.findByPk(supplierId);
    return supplier;
  } catch (error) {
    throw new Error('Error fetching supplier: ' + error.message);
  };
};


export const addSupplier = async (supplierData) => {
  try {
    const newSupplier = await suppliers.create(supplierData);
    return newSupplier;
  } catch (error) {
    throw new Error('Error creating supplier: ' + error.message);
  }
};


export const updateSupplierById = async (supplierId, updatedSupplierData) => {
  try {
    const supplier = await suppliers.findByPk(supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    await supplier.update(updatedSupplierData);
    return supplier;
  } catch (error) {
    throw new Error('Error updating supplier: ' + error.message);
  }
};


export const deleteSupplierById = async (supplierId) => {
  try {
    const supplier = await suppliers.findByPk(supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    await supplier.destroy();
    return { message: 'Supplier deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting supplier: ' + error.message);
  }
};

