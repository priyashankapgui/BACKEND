// routes/reviewRoutes.js

import express from 'express';
import {
    createReview,
    updateReview,
    getAllReviews,
    getReviewsByProductId,
} from './controller.js'; // Import the controller functions

const reviewRouter = express.Router();

reviewRouter.post('/review', createReview);
reviewRouter.put('/review/add', updateReview);
reviewRouter.get('/reviews', getAllReviews);
reviewRouter.get('/review/product', getReviewsByProductId);


export default reviewRouter;
