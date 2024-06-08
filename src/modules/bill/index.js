import * as billService from '../bill/service.js';
import * as billController from '../bill/controller.js';
import billRouter from '../bill/routes.js';
import bill from '../bill/bill.js';

export default {
    Controller: billController,
    Service: billService,
    Routes: billRouter,
    bill: bill,
};
