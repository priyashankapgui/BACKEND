import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Bill from "../bill/bill.js";
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
            model: ProductBatchSum,
            key: 'productId'
        }
    },
    batchNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: ProductBatchSum,
            key: 'batchNo'
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
    },
    billTotalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
});

// Define associations
BillProduct.belongsTo(Bill, { foreignKey: 'billNo' });
BillProduct.belongsTo(ProductBatchSum, { foreignKey: 'productId' });
BillProduct.belongsTo(ProductBatchSum, { foreignKey: 'batchNo' });
BillProduct.belongsTo(ProductBatchSum, { foreignKey: 'discount' });

export default BillProduct;
