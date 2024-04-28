import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
//import products from "../product/product.js";

export const setupAssociations = () => {
  //setupProductSupplierAssociations(products, suppliers);
  setupGRNSupplierAssociations(grn, suppliers);
  //setupProductGRNAssociations(grn, products);
};

// const setupProductSupplierAssociations = (productsModel, suppliersModel) => {
//   suppliersModel.belongsToMany(productsModel, { through: "product_Supplier" });
// };

const setupGRNSupplierAssociations = (grn, suppliers) => {
  suppliers.hasMany(grn, { foreignKey: "GRN_NO", as: "grn" }); 
};

// const setupProductGRNAssociations = (grnModel, productsModel) => {
//   grnModel.belongsToMany(productsModel, { through: "product_GRN" });
// };
