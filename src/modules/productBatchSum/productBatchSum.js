import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import productGRN from '../../modules/product_GRN/product_GRN.js';
import branches from '../branch/branch.js';
import products from '../product/product.js';

const ProductBatchSum = sequelize.define('ProductBatchSum', {
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
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalAvailableQty: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.FLOAT,
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
  indexes: [
    {
      unique: false,
      fields: ['productId']
    },
    {
      unique: false,
      fields: ['batchNo']
    },
    {
      unique: false,
      fields: ['branchId']
    }
  ],
  hooks: {
    beforeCreate: async (productBatchSumInstance, options) => {
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
ProductBatchSum.belongsTo(branches, { foreignKey: 'branchId' });

// Function to update branchName
const updateBranchName = async (productBatchSumInstance) => {
  try {
    const branch = await branches.findByPk(productBatchSumInstance.branchId);
    if (branch) {
      productBatchSumInstance.branchName = branch.branchName;
    } else {
      throw new Error('Branch not found');
    }
  } catch (error) {
    console.error('Error fetching branch:', error);
  }
};

// Function to update product info
const updateProductInfo = async (productBatchSumInstance) => {
  try {
    const productInstance = await products.findOne({
      where: {
        productId: productBatchSumInstance.productId,
      },
    });
    if (productInstance) {
      productBatchSumInstance.productName = productInstance.productName;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

export default ProductBatchSum;