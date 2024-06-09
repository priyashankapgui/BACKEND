import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import refund_Bill from '../refund_Bill/refund_Bill.js';
import billProduct from '../bill_Product/bill_Product.js';

const refund_Bill_Product = sequelize.define('refund_Bill_Product', {
    RTBNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: refund_Bill,
            key: 'RTBNo'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: billProduct,
            key: 'productId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    batchNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: billProduct,
            key: 'batchNo'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billQty: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    returnQty: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    returnPriceAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: 'refund_Bill_Product',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['RTBNo', 'productId','batchNo']
        }
    ]
});

// Define associations
refund_Bill_Product.belongsTo(refund_Bill, { foreignKey: 'RTBNo' });
refund_Bill_Product.belongsTo(billProduct, { foreignKey: 'productId' });
refund_Bill_Product.belongsTo(billProduct, { foreignKey: 'batchNo' });

export default refund_Bill_Product;
