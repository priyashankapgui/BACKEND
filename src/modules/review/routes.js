// routes/reviewRoutes.js

import express from 'express';
import {
    createReview,
    getReviewById,
    updateReview,
    getAllReviews,
    getReviewsByProductId,
} from './controller.js'; // Import the controller functions

const reviewRouter = express.Router();

reviewRouter.post('/review', createReview);
reviewRouter.get('/review/:id', getReviewById);
reviewRouter.put('/review/add', updateReview);
reviewRouter.get('/reviews', getAllReviews);
reviewRouter.get('/review/product/:productId', getReviewsByProductId);

export default reviewRouter;
