import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";
import categories from "./category/category.js";
import bill from "./bill/bill.js";
import userRole from "./userRole/userRole.js";

const setupBranchBillAssociations = (branches, bill) => {
  branches.hasMany(bill, { foreignKey: "branchId", as: "bill" });
  bill.belongsTo(branches, { foreignKey: "branchId" });
};

const setupGRNSupplierAssociations = (grn, suppliers) => {
  suppliers.hasMany(grn, { foreignKey: "supplierId", as: "grn" });
  grn.belongsTo(suppliers);
};


const setupGRNBranchAssociations = (grn, branches) => {
  branches.hasMany(grn, { foreignKey: "branchId", as: "grn" });
  grn.belongsTo(branches);
};


const setupProductBranchAssociations = (branches, products) => {
  branches.hasMany(products, { foreignKey: "branchId", as: "products" });
  products.belongsTo(branches);
};


const setupCategoryAssociations = (categories, products) => {
  categories.hasMany(products, { foreignKey: "categoryId", as: "products" });
  products.belongsTo(categories);
};


const setupProductSupplierAssociations = (suppliers, products) => {
  suppliers.belongsToMany(products, { through: "product_Supplier", foreignKey: 'supplierId' });
  products.belongsToMany(suppliers, { through: "product_Supplier" });
};

const setupProductGRNAssociations = (products, grn) => {
  products.belongsToMany(grn, { through: "product_GRN" });
  grn.belongsToMany(products, { through: "product_GRN" });
};


const setupBranchSupplierAssociations = (branches, suppliers) => {
  branches.belongsToMany(suppliers, { through: "branch_Supplier", foreignKey: 'branchId' });
  suppliers.belongsToMany(branches, { through: "branch_Supplier", foreignKey: 'supplierId' });
};



export const setupAssociations = () => {
  setupGRNSupplierAssociations(grn, suppliers);
  setupProductBranchAssociations(branches, products);
  setupGRNBranchAssociations(grn, branches);
  setupProductSupplierAssociations(suppliers, products);
  setupCategoryAssociations(categories, products);
  setupProductGRNAssociations(products, grn);
  setupBranchSupplierAssociations(branches, suppliers);
  setupBranchBillAssociations(branches, bill);
};