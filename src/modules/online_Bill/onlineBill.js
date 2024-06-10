import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import branches from '../branch/branch.js';
import Customer from '../customer/customer.js';

const onlineBill = sequelize.define('onlineBill',{
    onlineBillNo:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    branchId:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model:branches,
            key:'branchId'
        }
    },
    customerId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Customer,
            key:'customerId'
        }
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    acceptedBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName:'OnlineBill'
});
export default onlineBill;