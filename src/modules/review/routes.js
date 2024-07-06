// routes/reviewRoutes.js

import express from 'express';
import {
    createReview,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
    getReviewsByProductId,
} from './controller.js'; // Import the controller functions

const router = express.Router();

router.post('/review', createReview);
router.get('/review/:id', getReviewById);
router.put('/review/:id', updateReview);
router.delete('/review/:id', deleteReview);
router.get('/review', getAllReviews);
router.get('/review/product/:productId', getReviewsByProductId);

export default router;
