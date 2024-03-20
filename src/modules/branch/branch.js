import { DataType, DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import suppliers from "../supplier/supplier.js";

const branches = sequelize.define('branches',{
    branchId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    branchName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    contactNumber:{
        type: DataTypes.STRING(15)
    }
},{tableName:'branches'});

