import { DataTypes } from "sequelize";
import sequelize from "../../../../config/database.js";
import branches from "../../branch/branch.js";
import products from "../../product/product.js";


const stockReqIn = sequelize.define(
    "stockReqIn",
    {
        STNIn_No: {
            type: DataTypes.STRING, 
            allowNull: false,
            primaryKey: true,
          },

        requestBranch: {
            type: DataTypes.STRING, 
            allowNull: false,
            
          },

        supplyingBranch: {
            type: DataTypes.STRING, 
            allowNull: false,
            
          },

        requestedBy: {
            type: DataTypes.STRING, 
            allowNull: false,
            
          },

        submittedBy: {
            type: DataTypes.STRING, 
            allowNull: false,
            
          },
         
    },
    {
      tableName: "stockReqIn",
      timestamps: true,
    }
);


//New

stockReqIn.belongsTo(branches, { foreignKey: "branchId" });

export const setupProductStockReqInAssociations = () => {
  stockReqIn.belongsToMany(products, { through: "product_StockReqIn" });
};




export default stockReqIn;