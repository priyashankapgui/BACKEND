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
    primaryKey: true,
    references: {
      model: productGRN
    },
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
  branchName: {
    type: DataTypes.STRING,
    allowNull: false,
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
      await updateBranchName(productBatchSumInstance);
      await updateProductInfo(productBatchSumInstance);
    },
    beforeUpdate: async (productBatchSumInstance, options) => {
      await updateBranchName(productBatchSumInstance);
      await updateProductInfo(productBatchSumInstance);
    },
  },
});

// Relationship between productBatchSum and branches
productBatchSum.belongsTo(branches, { foreignKey: 'branchId' });

// Function to update branchName
const updateBranchName = async (productBatchSumInstance) => {
  const branch = await branches.findByPk(productBatchSumInstance.branchId);
  if (branch) {
    productBatchSumInstance.branchName = branch.branchName;
  }
};

// Function to update product info
const updateProductInfo = async (productBatchSumInstance) => {
  const productInstance = await products.findOne({
    where: {
      productId: productBatchSumInstance.productId,
    },
  });
  if (productInstance) {
    productBatchSumInstance.productName = productInstance.productName;
  }
};

export default productBatchSum;
