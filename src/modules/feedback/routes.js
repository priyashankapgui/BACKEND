import express from 'express';
import {  getFeedback ,createfeedback} from '../feedback/controller.js';


const feedbackrouter = express.Router();

feedbackrouter.post('/feedback', createfeedback);
feedbackrouter.get('/feedback', getFeedback);

//http://localhost:8082/feedback

export default feedbackrouter;

