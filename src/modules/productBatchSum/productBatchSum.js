import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import productGRN from '../../modules/product_GRN/product_GRN.js';
import branches from '../branch/branch.js';
import products from '../product/product.js';

const productBatchSum = sequelize.define('productBatchSum', {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: productGRN,
      key: 'productId',
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  batchNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalAvailableQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  branchId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: branches,
      key: 'branchId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  expDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
}, {
  tableName: 'product_batch_sum',
  timestamps: false,
  hooks: {
    beforeCreate: async (productBatchSumInstance, options) => {
      console.log('Before Create Hook Called');
      const productGRNInstance = await productGRN.findOne({
        where: {
          productId: productBatchSumInstance.productId,
          batchNo: productBatchSumInstance.batchNo,
          branchId: productBatchSumInstance.branchId,
        },
      });
      if (productGRNInstance) {
        console.log('ProductGRN Instance Found:', productGRNInstance);
        productBatchSumInstance.expDate = productGRNInstance.expDate;
        productBatchSumInstance.sellingPrice = productGRNInstance.sellingPrice;
        if (productGRNInstance.barcode) {
          productBatchSumInstance.barcode = productGRNInstance.barcode;
        }
      } else {
        console.log('ProductGRN Instance Not Found');
      }

      const productInstance = await products.findOne({
        where: {
          productId: productBatchSumInstance.productId,
        },
      });
      if (productInstance) {
        console.log('Product Instance Found:', productInstance);
        productBatchSumInstance.productName = productInstance.productName;
      } else {
        console.log('Product Instance Not Found');
      }
    },
    beforeUpdate: async (productBatchSumInstance, options) => {
      const productGRNInstance = await productGRN.findOne({
        where: {
          productId: productBatchSumInstance.productId,
          batchNo: productBatchSumInstance.batchNo,
          branchId: productBatchSumInstance.branchId,
        },
      });
      if (productGRNInstance) {
        console.log('ProductGRN Instance Found:', productGRNInstance);
        productBatchSumInstance.expDate = productGRNInstance.expDate;
        productBatchSumInstance.sellingPrice = productGRNInstance.sellingPrice;
        if (productGRNInstance.barcode) {
          productBatchSumInstance.barcode = productGRNInstance.barcode;
        }
      } else {
        console.log('ProductGRN Instance Not Found');
      }

      const productInstance = await products.findOne({
        where: {
          productId: productBatchSumInstance.productId,
        },
      });
      if (productInstance) {
        console.log('Product Instance Found:', productInstance);
        productBatchSumInstance.productName = productInstance.productName;
      } else {
        console.log('Product Instance Not Found');
      }
    },
  },
});

productBatchSum.belongsTo(products, { foreignKey: 'productId' });
products.hasMany(productBatchSum, { foreignKey: 'productId' });

export default productBatchSum;
