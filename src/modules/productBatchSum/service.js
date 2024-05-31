import sequelize from "../../../config/database.js";
//import { Op } from 'sequelize';
import { Op, fn, col } from 'sequelize';
import ProductBatchSum from "../productBatchSum/productBatchSum.js";
import productGRN from "../../modules/product_GRN/product_GRN.js";
import productBatchSum from "../productBatchSum/productBatchSum.js";

export const updateProductBatchSum = async (productId, batchNo) => {
    try {
      // Fetch the total available quantity for the given productId and batchNo
      const result = await productGRN.findOne({
        attributes: [
          'productId',
          'batchNo',
          [fn('SUM', col('availableQty')), 'totalAvailableQty']
        ],
        where: {
          productId: productId,
          batchNo: batchNo,
          expDate: {
            [Op.or]: [
              { [Op.is]: null },
              { [Op.gte]: new Date() }
            ]
          }
        }, 
        group: ['productId', 'batchNo']
      });
  
      if (result) {
        const { totalAvailableQty } = result.dataValues;
  
        // Upsert the total available quantity into ProductBatchSum
        await productBatchSum.upsert({
          productId: productId,
          batchNo: batchNo,
          totalAvailableQty: totalAvailableQty
        });
  
        console.log(`Updated ProductBatchSum for productId ${productId}, batchNo ${batchNo} to ${totalAvailableQty}`);
      } else {
        // If no matching records, remove any existing entry in ProductBatchSum
        await productBatchSum.destroy({
          where: {
            productId: productId,
            batchNo: batchNo
          }
        });
  
        console.log(`Removed ProductBatchSum entry for productId ${productId}, batchNo ${batchNo}`);
      }
    } catch (error) {
      console.error("Error updating ProductBatchSum:", error);
      throw error;
    }
  };