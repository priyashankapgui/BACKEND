import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
//import productGRN from '../productGRN/productGRN.js';
import branches from '../branch/branch.js';

const productBatchSum = sequelize.define('productBatchSum', {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  batchNo: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
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
      key: "branchId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
  },
  expDate: {
    type: DataTypes.DATE,
    allowNull: true, // Allow expDate to be nullable 
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
    // Before creating a new record in productBatchSum
    beforeCreate: async (productBatchSumInstance, options) => {
      console.log('Before Create Hook Called');
      // Fetch expDate and selling price from productGRN and set it
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
      }else {
        console.log('ProductGRN Instance Not Found');
      }
    },
    beforeUpdate: async (productBatchSumInstance, options) => {
      // Fetch expDate and selling price from productGRN and set it
      const productGRNInstance = await productGRN.findOne({
        where: {
          productId: productBatchSumInstance.productId,
          batchNo: productBatchSumInstance.batchNo,
          branchId: productBatchSumInstance.branchId,
        },
      });
      if (productGRNInstance) {
        productBatchSumInstance.expDate = productGRNInstance.expDate;
        productBatchSumInstance.sellingPrice = productGRNInstance.sellingPrice;
      }
    },
  },
});

export default productBatchSum;
 