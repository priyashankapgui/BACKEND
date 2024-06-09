import * as ProductBatchUpdateReasonController from "../productBatchUpdateReason/controller.js";
import * as ProductBatchUpdateReasonService from "../productBatchUpdateReason/service.js";
import * as ProductBatchUpdateReasonRouter from "../productBatchUpdateReason/routes.js";
import ProductBatchUpdateReason from "../productBatchUpdateReason/productBatchUpdateReason.js";

export default  {
    Controller: ProductBatchUpdateReasonController,
    Service: ProductBatchUpdateReasonService,
  Routes: ProductBatchUpdateReasonRouter,
  ProductBatchUpdateReason: ProductBatchUpdateReason,
};

