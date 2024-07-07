

import * as reviewService from './service.js'; // Import the service functions

const createReview = async (req, res) => {
    try {
        const reviewData = req.body;

        const totalStars = 
            (reviewData.oneStar || 0) * 1 +
            (reviewData.twoStars || 0) * 2 +
            (reviewData.threeStars || 0) * 3 +
            (reviewData.fourStars || 0) * 4 +
            (reviewData.fiveStars || 0) * 5;
        const numberOfReviews =
            (reviewData.oneStar || 0) +
            (reviewData.twoStars || 0) +
            (reviewData.threeStars || 0) +
            (reviewData.fourStars || 0) +
            (reviewData.fiveStars || 0);
        const averageRating = numberOfReviews ? totalStars / numberOfReviews : 0;

        reviewData.totalStars = totalStars;
        reviewData.numberOfReviews = numberOfReviews;
        reviewData.averageRating = averageRating;
        console.log(reviewData.totalStars);
        console.log(reviewData.numberOfReviews);
        console.log(reviewData.averageRating);

        const review = await reviewService.createReview(reviewData);
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getReviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await reviewService.getReviewById(id);
        if (!review) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateReview = async (req, res) => {
    const { productId } = req.params; 
    
    console.log(productId);// Assuming productId is part of the URL
    try {
        // Assuming reviewService.updateReview handles updating based on productId
        const review = await reviewService.updateReview(productId, req.body);
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getReviewsByProductId = async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await reviewService.getReviewsByProductId(productId);
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export {
    createReview,
    getReviewById,
    updateReview,
    getAllReviews,
    getReviewsByProductId,
};
