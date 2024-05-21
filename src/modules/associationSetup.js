import suppliers from "../modules/supplier/supplier.js";
import grn from "../modules/GRN/grn.js";
import branches from "../modules/branch/branch.js"
import products from "../modules/product/product.js";
import bill from "./bill/bill.js";
// import stockReqIn from "./stockTransfer/stockReqIn/stockReqIn.js";
// import stockReqOut from "./stockTransfer/stockReqOut/stockReqOut.js";

export const setupAssociations = () => {

  setupGRNSupplierAssociations(grn, suppliers);
  setupProductBranchAssociations(branches, products);
  setupGRNBranchAssociations(grn, branches);
  setupBranchBillAssociations(branches, bill);
  // setupBranchStockReqInAssociations();
  // setupBranchStockReqOutAssociations();
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

const setupBranchBillAssociations = (branches, bill) => {
  branches.hasMany(bill, { foreignKey: "branchId", as: "bill" });
  bill.belongsTo(branches, { foreignKey: "branchId" });
};

// export const setupBranchStockReqInAssociations = () => {
//   branches.hasMany(stockReqIn, { foreignKey: "STNIn_No", as: "stockReqIn" });
// };

// export const setupBranchStockReqOutAssociations = () => {
//   branches.hasMany(stockReqOut, { foreignKey: "STNOut_No", as: "stockReqOut" });
// };