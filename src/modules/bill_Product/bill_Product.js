import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bill from '../bill/bill.js';
import ProductBatchSum from '../productBatchSum/productBatchSum.js';

const bill_Product = sequelize.define('bill_Product', {
    billNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: bill,
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
        type: DataTypes.FLOAT,
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
    }
});

bill_Product.belongsTo(bill, { foreignKey: 'billNo', targetKey: 'billNo' });
bill_Product.belongsTo(ProductBatchSum, { foreignKey: 'productId', targetKey: 'productId' });
bill_Product.belongsTo(ProductBatchSum, { foreignKey: 'batchNo', targetKey: 'batchNo' });


export default bill_Product;
