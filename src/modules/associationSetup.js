import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";
import categories from "./category/category.js";
import bill from "./bill/bill.js";
import Customer from "./customer/customer.js";
import ShoppingCart from "./cart_Customer/shoppingcart.js";
import productBatchSum from "./productBatchSum/productBatchSum.js";
import productGRN from "./product_GRN/product_GRN.js";

const setupBranchBillAssociations = (branches, bill) => {
  branches.hasMany(bill, { foreignKey: "branchId", as: "bill" });
  bill.belongsTo(branches, { foreignKey: "branchId" });
};

const setupGRNSupplierAssociations = (grn, suppliers) => { 
  suppliers.hasMany(grn, { foreignKey: "supplierId", as: "grns" });
  grn.belongsTo(suppliers, { foreignKey: "supplierId" });
}; 


const setupGRNBranchAssociations = (grn, branches) => {
  branches.hasMany(grn, { foreignKey: "branchId", as: "grns" });
  grn.belongsTo(branches, { foreignKey: "branchId" });
};


const setupCategoryAssociations = (categories, products) => {
  categories.hasMany(products, { foreignKey: "categoryId", as: "products" });
  products.belongsTo(categories, { foreignKey: "categoryId" });
};


const setupProductGRNAssociations = (products, grn) => {
  products.belongsToMany(grn, { through: productGRN });
  grn.belongsToMany(products, { through: productGRN });
}; 

// const setupProductGRNandGRNssociations = (productGRN, grn) => {
//   grn.hasMany(productGRN, { foreignKey: 'GRN_NO' });
//   productGRN.belongsTo(grn, { foreignKey: "GRN_NO" });
// }

const setupCartCustomerAssociations = (ShoppingCart,Customer) => {
  ShoppingCart.hasOne(Customer);
  Customer.belongsTo(ShoppingCart, {    foreignKey: 'customerId'  });
}

const setupCartProductAssociations = (ShoppingCart, products) => {
  ShoppingCart.belongsToMany(products, { through: "cart_Product", foreignKey: 'cartId' });
  products.belongsToMany(ShoppingCart, { through: "cart_Product", foreignKey: 'productId' });
}



const setupProductBatchSumAssociations = (productBatchSum, productGRN) => {
  productBatchSum.belongsTo(productGRN, {
    foreignKey: 'productId',
    targetKey: 'productId',
    as: 'productGRN',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  productBatchSum.belongsTo(productGRN, {
    foreignKey: 'batchNo',
    targetKey: 'batchNo',
    as: 'productBatch',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};



export const setupAssociations = () => {
  setupGRNSupplierAssociations(grn, suppliers);
  setupGRNBranchAssociations(grn, branches);
  setupCategoryAssociations(categories, products);
  setupProductGRNAssociations(products, grn);
  setupBranchBillAssociations(branches, bill);
  setupCartCustomerAssociations(ShoppingCart,Customer);
  setupCartProductAssociations(ShoppingCart,products);
  setupProductBatchSumAssociations(productBatchSum, productGRN);
  //setupProductGRNandGRNssociations(productGRN, grn)

};