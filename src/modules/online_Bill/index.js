import * as onlineBillServices from './service.js';
import * as onlineBillControllers from './controller.js';
import * as onlineBillRoutes from './routes.js';
import onlineBill from './onlineBill';

export default{
    Controller: onlineBillControllers,
    Service: onlineBillServices,
    Routes: onlineBillRoutes,
    Supplier: onlineBill
};