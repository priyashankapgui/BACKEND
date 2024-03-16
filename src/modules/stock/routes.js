import express from 'express';
import { createStock, getStocks, getStock, updateStock, deleteStock } from '../stock/controller.js';

const stockRouter = express.Router();

stockRouter.get('/stocks', getStocks);
stockRouter.get('/stocks/:GRN_NO', getStock);
stockRouter.post('/stocks', createStock);
stockRouter.put('/stocks/:GRN_NO', updateStock);
stockRouter.delete('/stocks/:GRN_NO', deleteStock);



export default stockRouter;