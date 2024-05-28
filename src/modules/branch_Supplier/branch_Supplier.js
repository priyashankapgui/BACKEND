import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import Branch from '../branch/branch.js';
import Supplier from '../supplier/supplier.js';

const BranchSupplier = sequelize.define('branch_Supplier', {
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Branch,
      key: 'branchId',
    },
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Supplier,
      key: 'supplierId',
    },
  },
}, {
  tableName: 'branch_Supplier',
  timestamps: true,
});

export default BranchSupplier;
