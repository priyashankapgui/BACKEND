import * as stockTransferController from "../stockTransfer/controller.js";
import * as StockTransferService from "../stockTransfer/service.js";
import * as stockTransferRoutes from "../stockTransfer/routes.js";
import stockTransfer from "../stockTransfer/stockTransfer.js";

export default {
  Controller: stockTransferController,
  Service: StockTransferService,
  Routes: stockTransferRoutes,
  stockTransfer: stockTransfer,
};
