import * as SupplierController from '../supplier/controller.js';
import * as SupplierService from '../supplier/service.js';
import * as SupplierRoutes from '../supplier/routes.js';
import suppliers from '../supplier/supplier.js'; 

  module.exports = {
    Controller: SupplierController,
    Service: SupplierService,
    Routes: SupplierRoutes,
    Supplier: suppliers,
  };
  

  

