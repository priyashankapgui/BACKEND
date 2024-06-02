import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Bill from "../bill/bill.js";
import Product from "../product/product.js";
import ProductGRN from "../product_GRN/product_GRN.js";
import ProductBatchSum from "../productBatchSum/productBatchSum.js";

const BillProduct = sequelize.define('BillProduct', {
    billNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Bill,
            key: 'billNo'
        }
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Product,
            key: 'productId'
        }
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    billQty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sellingPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    batchNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    availableQty: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define associations
BillProduct.belongsTo(Bill, { foreignKey: 'billNo' });
BillProduct.belongsTo(Product, { foreignKey: 'productId' });
BillProduct.belongsTo(ProductGRN, { foreignKey: 'batchNo' });
BillProduct.belongsTo(ProductBatchSum, { foreignKey: 'discount' });

export default BillProduct;
