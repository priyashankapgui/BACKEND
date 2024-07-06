import express from 'express';
import * as Controller from "../GRN/controller.js";
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const GRNRouter = express.Router();

GRNRouter.get('/grn', authenticateTokenWithPermission('good-receive'), Controller.getGRNs);
GRNRouter.post('/grn', authenticateTokenWithPermission('good-receive'), Controller.createGRNAndProduct);
GRNRouter.get('/grn-all', authenticateTokenWithPermission('good-receive'), Controller.getGRNDetailsController);




export default GRNRouter;