import * as billRouter from '../bill/routes.js';
import * as service from '../bill/service.js'; // Import all functions from service.js
import * as controller from '../bill/controller.js'; // Import all functions from controller.js
import * as constants from '../bill/constants.js'; // Import all constants from constants.js
import bill from '../bill/bill.js';

module.exports = {
    billRouter,
    service,
    controller,
    constants,
    bill
};
