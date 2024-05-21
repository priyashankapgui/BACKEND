
import stockReqOut from './stockReqOut';

exports.createStockTransfer = async (requestBranch, supplyingBranch, products) => {
    const transaction = await sequelize.transaction();
    try {
        const transfer = await StockTransfer.create({
            requestBranch,
            supplyingBranch
        }, { transaction });

        for (const product of products) {
            await ProductDetail.create({
                stockTransferId: transfer.id,
                productId: product.productId,
                productName: product.productName,
                quantity: product.quantity,
                comment: product.comment
            }, { transaction });
        }

        await transaction.commit();
        return transfer;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
