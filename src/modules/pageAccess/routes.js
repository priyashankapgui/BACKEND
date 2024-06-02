import express from 'express';
import { getPages } from './controller.js';

const PageAccessRouter = express.Router();

PageAccessRouter.get('/getPages', getPages);

export default PageAccessRouter;