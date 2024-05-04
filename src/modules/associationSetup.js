import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";

export const setupAssociations = () => {

  setupGRNSupplierAssociations(grn, suppliers);
  setupProductBranchAssociations(branches, products);
  setupGRNBranchAssociations(grn, branches);
};



const setupGRNSupplierAssociations = (grn, suppliers) => {
  suppliers.hasMany(grn, { foreignKey: "supplierId", as: "grn" }); 
};

const setupGRNBranchAssociations = (grn, branches) => {
  branches.hasMany(grn, { foreignKey: "branchId", as: "grn" }); 
};


const setupProductBranchAssociations = (branches, products) => {
  branches.hasMany(products, { foreignKey: "productId", as: "products" }); 
};


