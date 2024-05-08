import { DataTypes } from "sequelize";
import sequelize from "../../../../config/database.js";
import branches from "../../branch/branch.js";
import products from "../../product/product.js";


const stockReqOut = sequelize.define(
    "stockReqOut",
    {
        STNOut_No: {
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
      tableName: "stockReqOut",
      timestamps: true,
    }
);

//New

stockReqOut.belongsTo(branches, { foreignKey: "branchId" });

export const setupProductStockReqOutAssociations = () => {
    stockReqOut.belongsToMany(products, { through: "product_StockReqOut" });
  };

export default stockReqOut;