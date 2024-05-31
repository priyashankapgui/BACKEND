import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";
import categories from "./category/category.js";
import bill from "./bill/bill.js";
import Customer from "./customer/customer.js";
import ShoppingCart from "./Cart_Customer/shoppingcart.js";
import bill_Product from "./bill_Product/bill_Product.js";
import productBatchSum from "./productBatchSum/productBatchSum.js";
import productGRN from "./product_GRN/product_GRN.js";

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

const setupCartCustomerAssociations = (ShoppingCart,Customer) => {
  ShoppingCart.hasOne(Customer);
  Customer.belongsTo(ShoppingCart, {    foreignKey: 'customerId'  });
}

const setupCartProductAssociations = (ShoppingCart, products) => {
  ShoppingCart.belongsToMany(products, { through: "cart_Product", foreignKey: 'cartId' });
  products.belongsToMany(ShoppingCart, { through: "cart_Product", foreignKey: 'productId' });
}

const setupBill_ProductProductAssoociation = (bill_Product, products) => {
  products.belongsToMany(bill, { through: bill_Product, foreignKey: 'productId' });
  bill_Product.belongsToMany(products, { through: bill_Product, foreignKey: 'billNo' });
}

const productBatchSumBillAssocialtion = () => {
  productBatchSum.belongsToMany(bill, { through: bill_Product, foreignKey: 'batchNo' });
  bill.belongsToMany(productBatchSum, { through: bill_Product, foreignKey: 'billNo' });
}

const  productGRNBillAssociation = () => {
  productGRN.belongsToMany(bill, { through: bill_Product, foreignKey: 'GRN_NO' });
  bill.belongsToMany(productGRN, { through: bill_Product, foreignKey: 'billNo' }); 
  
}





export const setupAssociations = () => {
  setupGRNSupplierAssociations(grn, suppliers);
  setupProductBranchAssociations(branches, products);
  setupGRNBranchAssociations(grn, branches);
  setupProductSupplierAssociations(suppliers, products);
  setupCategoryAssociations(categories, products);
  setupProductGRNAssociations(products, grn);
  setupBranchSupplierAssociations(branches, suppliers);
  setupBranchBillAssociations(branches, bill);
  setupCartCustomerAssociations(ShoppingCart,Customer);
  setupCartProductAssociations(ShoppingCart,products);
  setupBill_ProductProductAssoociation(bill_Product, products);

};