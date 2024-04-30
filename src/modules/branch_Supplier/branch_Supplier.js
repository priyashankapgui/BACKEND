import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import branches from '../branch/branch.js';
import suppliers from '../supplier/supplier.js';

const branchSupplier = sequelize.define(
  'branch_Supplier',
  {
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //primaryKey: true,
      references: {
        model: branches,
        key: 'branchId'
      }
    },
    supplierId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
      //primaryKey: true,
      references: {
        model: suppliers, 
        key: 'supplierId'
      }
    },
  }, 
  {
    tableName: 'branch_Supplier',
    timestamps: true,
    //primaryKey: ['branchId', 'supplierId']
  }
);

branchSupplier.belongsTo(branches, { foreignKey: 'branchId' });
branchSupplier.belongsTo(suppliers, { foreignKey: 'supplierId' });

export default branchSupplier;
 

// import { DataTypes } from 'sequelize';
// import sequelize from '../../../config/database.js';

// const branchSupplier = sequelize.define('branch_Supplier', {
//   // Other attributes of the join table
// }, {
//   // Define composite primary key
//   primaryKey: true,
//   foreignKey: {
//     name: 'branchId',
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//   },
//   foreignKey: {
//     name: 'supplierId',
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//   },
// });

// export default branchSupplier;