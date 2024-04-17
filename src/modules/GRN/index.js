import * as GRNController from '../GRN/controller.js';
import * as GRNService from '../GRN/service.js';
import * as GRNRoutes from '../GRN/routes.js';
import grn from '../GRN/grn.js'; 

  module.exports = {
    Controller: GRNController,
    Service: GRNService,
    Routes: GRNRoutes,
    GRN: grn,
  };
  