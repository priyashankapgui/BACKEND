import express from 'express';
import {  getfeedback ,createfeedback} from '../feedback/controller.js';
import { getAllfeedback } from '../feedback/service.js';
import feedback from './feedback.js';

const feedbackrouter = express.Router();

feedbackrouter.post('/feedback', createfeedback);
feedbackrouter.get('/feedback', getfeedback);

//http://localhost:8082/feedback

export default feedbackrouter;

