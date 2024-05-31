// import { DataTypes } from "sequelize";
// import sequelize from "../../../config/database";
// import bill from "../bill/bill.js";
// import products from "../product/product.js";
// import productGRN from "../product_GRN/product_GRN.js";

// const bill_Product = sequelize.define('bill_Product', {
//     billNo: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//         references: {
//             model: bill,
//             key: 'billNo'
//         }
//     },
//     productId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//         references: {
//             model: products,
//             key: 'productId'
//         }
//     },
//     barcode: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         references: {
//             model: products,
//         }
//     },
//     productName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: products,
//         }
//     },
//     billQty: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     sellingPrice: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//         references: {
//             model: productGRN,
//         }
//     },
//     batchNo: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: productGRN,
//         }
//     },
//     availableQty: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: productGRN,
//         }
//     },
//     discount: {
//         type: DataTypes.FLOAT,
//         allowNull: true,
//     },
//     amount: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//     },
//     paymentMethod: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });

// export default bill_Product;