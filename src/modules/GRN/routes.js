import express from 'express';
import * as Controller from "../GRN/controller.js"

const GRNRouter = express.Router();

GRNRouter.get('/grn', Controller.getGRNs);
GRNRouter.post('/grn', Controller.createGRNAndProduct);
GRNRouter.get('/grn-all', Controller.getGRNDetailsController);




export default GRNRouter;