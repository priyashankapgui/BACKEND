import stockTransfer from "../stockTransfer/stockTransfer.js";
import TransferProduct from "../TransferProduct/TransferProduct.js";
import TransferProductBatch from "../TransferProductBatch/TransferProductBatch.js";
import products from "../product/product.js";
import { to, TE } from "../../helper.js";


//Function to generate STN_NO
export const generateSTN_NO = async () => {
  try {
    const latestTransfer = await stockTransfer.findOne({
      order: [['STN_NO', 'DESC']],
      attributes: ['STN_NO'],
    });

    let newSTN_NO;

    if (latestTransfer && latestTransfer.STN_NO) {
      const numericPart = parseInt(latestTransfer.STN_NO.substring(3), 10);
      const incrementedNumericPart = numericPart + 1;

      newSTN_NO = `STN${incrementedNumericPart.toString().padStart(5, '0')}`;
    } else {
      newSTN_NO = 'STN00001';
    }

    return newSTN_NO;
  } catch (error) {
    console.error('Error generating new STN_NO:', error);
    throw new Error('Could not generate new STN_NO');
  }
};



// Function to create Stock TransferOUT
export const addStockTransfer = async (requestedBy, requestBranch, supplyingBranch) => {
    try {
      const STN_NO = await generateSTN_NO();
  
      const stockTransferData = await stockTransfer.create({
        STN_NO,
        requestedBy,
        requestBranch,
        supplyingBranch,
        status: 'raised', // Automatically set status to 'raised'
      });
  
      return stockTransferData;
    } catch (error) {
      throw new Error('Error creating Stock Transfer entry: ' + error.message);
    }
  };



//Function to update data in stock transfer table when staock transfer IN
  export const updateStockTransferSubmitted = async (STN_NO, submittedBy) => {
    try {
      const stockTransferEntry = await stockTransfer.findOne({ where: { STN_NO } });
  
      if (!stockTransferEntry) {
        throw new Error('Stock Transfer not found');
      }
  
      stockTransferEntry.submittedBy = submittedBy;
      stockTransferEntry.submittedAt = new Date();
      stockTransferEntry.status = 'completed';
      await stockTransferEntry.save();
  
      return stockTransferEntry;
    } catch (error) {
      throw new Error('Error updating Stock Transfer: ' + error.message);
    }
  };


  
//Function to cancel stock request IN
export const cancelStockTransfer = async (STN_NO, submittedBy) => {
  const [err, stockTransferRecord] = await to(stockTransfer.findOne({
    where: { STN_NO },
  }));

  if (err) TE(err);
  if (!stockTransferRecord) TE('Stock Transfer not found');

  stockTransferRecord.status = 'cancelled';
  stockTransferRecord.submittedBy = submittedBy;
  stockTransferRecord.submittedAt = new Date();

  const [saveErr, updatedRecord] = await to(stockTransferRecord.save());

  if (saveErr) TE(saveErr);

  return updatedRecord;
};




  export const getAllStockTransfers = async () => {
    try {
        const stockTransfers = await stockTransfer.findAll({
            attributes: ['STN_NO', 'requestBranch', 'supplyingBranch', 'submittedBy', 'requestedBy', 'submittedAt', 'status', 'createdAt'],
        });

        const transfersWithProducts = await Promise.all(stockTransfers.map(async (transfer) => {
            const productData = await TransferProduct.findAll({
                where: { STN_NO: transfer.STN_NO },
                attributes: ['productId', 'requestedQty', 'createdAt'],
            });

            const productsWithDetails = await Promise.all(productData.map(async (product) => {
                const productInfo = await products.findOne({
                    where: { productId: product.productId },
                    attributes: ['productName'],
                    raw: true,
                });

                if (!productInfo) {
                    throw new Error(`Product not found for productId: ${product.productId}`);
                }

                return {
                    ...product.dataValues,
                    productName: productInfo.productName,
                };
            }));

            return {
                ...transfer.dataValues,
                products: productsWithDetails,
            };
        }));

        return transfersWithProducts;
    } catch (error) {
        console.error('Error fetching stock transfers:', error);
        throw new Error('Failed to fetch stock transfers');
    }
};




  export const getAllStockTransferDetailsBySTN_NO = async (STN_NO) => {
    try {
        const transferData = await stockTransfer.findOne({
            where: { STN_NO },
            attributes: ['STN_NO', 'requestBranch', 'supplyingBranch', 'submittedBy', 'requestedBy', 'submittedAt', 'status', 'createdAt'],
        });

        if (!transferData) {
            throw new Error('Stock transfer not found');
        }

        const productData = await TransferProduct.findAll({
            where: { STN_NO },
            attributes: ['productId', 'requestedQty', 'createdAt'],
        });

        if (!productData.length) {
            throw new Error('No products found for the given STN_NO');
        }

        const productsWithDetails = await Promise.all(productData.map(async (product) => {
            const productInfo = await products.findOne({
                where: { productId: product.productId },
                attributes: ['productName'],
                raw: true,
            });

            if (!productInfo) {
                throw new Error(`Product not found for productId: ${product.productId}`);
            }

            const batchDetails = await TransferProductBatch.findAll({
                where: {
                    STN_NO,
                    productId: product.productId,
                },
                attributes: ['batchNo', 'transferQty', 'unitPrice', 'amount'],
            });

            return {
                ...product.dataValues,
                productName: productInfo.productName,
                batches: batchDetails,
            };
        }));

        return {
            ...transferData.dataValues,
            products: productsWithDetails.map((product) => ({
                productId: product.productId,
                productName: product.productName,
                requestedQty: product.requestedQty,
                createdAt: product.createdAt,
                batches: product.batches.map((batch) => ({
                    batchNo: batch.batchNo,
                    transferQty: batch.transferQty,
                    unitPrice: batch.unitPrice,
                    amount: batch.amount,
                })),
            })),
        };
    } catch (error) {
        console.error('Error fetching stock transfer details by STN_NO:', error);
        throw new Error('Failed to fetch stock transfer details');
    }
};




