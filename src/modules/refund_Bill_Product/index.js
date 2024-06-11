import * as refundBillService from '../refund_Bill/service.js';
import * as refundBillController from '../refund_Bill/controller.js';
import refundBillRouter from '../refund_Bill/routes.js';
import refund_Bill from '../refund_Bill/bill.js';
import * as refundBillProductService from '../refund_Bill_Product/service.js';
import refund_Bill_Product from '../refund_Bill_Product/refund_Bill_Product.js';

export default {
    Controller: refundBillController,
    Service: refundBillService,
    Routes: refundBillRouter,
    refund_Bill: refund_Bill,
    refundBillProductService: refundBillProductService,
    refund_Bill_Product: refund_Bill_Product,
};
