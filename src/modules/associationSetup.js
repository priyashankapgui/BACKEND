import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";
import categories from "./category/category.js";



const setupGRNSupplierAssociations = (grn, suppliers) => {
  suppliers.hasMany(grn, { foreignKey: "GRN_NO", as: "grn" }); 
  grn.belongsTo(suppliers, { foreignKey: "supplierId" });
};


const setupGRNBranchAssociations = (grn, branches) => {
  branches.hasMany(grn, { foreignKey: "GRN_NO", as: "grn" }); 
  grn.belongsTo(branches, { foreignKey: "branchId"} );
};


const setupProductBranchAssociations = (branches, products) => {
  branches.hasMany(products, { foreignKey: "productId", as: "products" }); 
  products.belongsTo(branches, { foreignKey: "branchId" });
};


const setupCategoryAssociations = (categories, products) => {
  categories.hasMany(products, { foreignKey: "productId", as: "products" });
  products.belongsTo(categories, { foreignKey: "categoryId" });
};


const setupProductSupplierAssociations = (suppliers, products) => {
  suppliers.belongsToMany(products, { through: "product_Supplier" });
  products.belongsToMany(suppliers, { through: "product_Supplier" });
};

const setupProductGRNAssociations = (products, grn) => {
  products.belongsToMany(grn, { through: "product_GRN" });
  grn.belongsToMany(products, { through: "product_GRN" });
};


const setupBranchSupplierAssociations = (branches, suppliers) => {
  branches.belongsToMany(suppliers, { through: "branch_Supplier" });
  suppliers.belongsToMany(branches, { through: "branch_Supplier" });
};




export const setupAssociations = () => {
  setupGRNSupplierAssociations(grn, suppliers);
  setupProductBranchAssociations(branches, products);
  setupGRNBranchAssociations(grn, branches);
  setupProductSupplierAssociations(suppliers, products);
  setupCategoryAssociations(categories, products);
  setupProductGRNAssociations(products, grn);
  setupBranchSupplierAssociations(branches, suppliers);
  
};