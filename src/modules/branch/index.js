import * as BranchController from './controller.js';
import * as BranchServices from './service.js';
import * as BranchRoutes from './routes.js';
import branches from './branch';

export default {
    Controller: BranchController,
    Service: BranchServices,
    Routes: BranchRoutes,
    branches: branches
};