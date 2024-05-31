import * as billRouter from '../bill/routes.js';
import * as billService from '../bill/service.js'; // Import all functions from service.js
import * as billController from '../bill/controller.js'; // Import all functions from controller.js
import * as constants from '../bill/constants.js'; // Import all constants from constants.js
import bill from '../bill/bill.js';


export default  {
    Controller: billController,
    Service: billService,
    Routes: billRouter,
    bill: bill,
  };