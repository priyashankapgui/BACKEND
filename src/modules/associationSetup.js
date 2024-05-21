import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";
import Customer from "./customer/customer.js";
import ShoppingCart from "./Cart_Customer/shoppingcart.js";

export const setupAssociations = () => {
  //setupProductSupplierAssociations(products, suppliers);
  setupGRNSupplierAssociations(grn, suppliers);
  //setupProductGRNAssociations(grn, products);
  //setupBranchSupplierAssociations(branches, suppliers);
  setupProductBranchAssociations(branches, products);
  setupGRNBranchAssociations(grn, branches);
  setupCartCustomerAssociations(ShoppingCart,Customer);
  setupCartProductAssociations(ShoppingCart,products);
};

// const setupProductSupplierAssociations = (productsModel, suppliersModel) => {
//   suppliersModel.belongsToMany(productsModel, { through: "product_Supplier" });
// };

const setupGRNSupplierAssociations = (grn, suppliers) => {
  suppliers.hasMany(grn, { foreignKey: "supplierId", as: "grn" }); 
};

const setupGRNBranchAssociations = (grn, branches) => {
  branches.hasMany(grn, { foreignKey: "branchId", as: "grn" }); 
};



const setupProductBranchAssociations = (branches, products) => {
  branches.hasMany(products, { foreignKey: "productId", as: "products" }); 
};


// const setupProductGRNAssociations = (grnModel, productsModel) => {
//   grnModel.belongsToMany(productsModel, { through: "product_GRN" });
// };
const setupCartCustomerAssociations = (ShoppingCart,Customer) => {
  ShoppingCart.hasOne(Customer);
  Customer.belongsTo(ShoppingCart, {    foreignKey: 'customerId'  });
}

export const setupCartProductAssociations = (ShoppingCart,products) => {
  ShoppingCart.belongsToMany(products, { through: "cart_Product" });
products.belongsToMany(ShoppingCart, { through: "cart_Product" });
};