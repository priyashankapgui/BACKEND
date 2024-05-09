
import stockTransferService from "../stockReqOut/service.js"

exports.createStockTransfer = async (req, res) => {
    try {
        const { requestBranch, supplyingBranch, products } = req.body;
        const newTransfer = await stockTransferService.createStockTransfer(requestBranch, supplyingBranch, products);
        res.status(201).json(newTransfer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating stock transfer', error: error.message });
    }
};
