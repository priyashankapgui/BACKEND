// services/reviewService.js

import e from 'express';
import Review from './review.js';

const createReview = async (reviewData) => {
    try {
        const review = await Review.create(reviewData);
        return review;
        
    } catch (err) {
        throw new Error(err);
    }
};


const getReviewById = async (id) => {
    try {
        const review = await Review.findByPk(id);
        return review;
    } catch (err) {
        throw new Error('Failed to retrieve review');
    }
};

const updateReview = async (productId, reviewData) => {
    try {
        // Assuming your Sequelize model is named Review and you want to update reviews for a product
        const updatedRows = await Review.update(reviewData, {
            where: { productId: productId },
        });

        if (updatedRows > 0) {
            // Successfully updated, retrieve the updated review(s)
            const updatedReviews = await Review.findAll({
                where: { productId: productId },
            });
            return updatedReviews;
        }

        throw new Error('Review not found or not updated');
    } catch (err) {
        throw new Error('Failed to update review');
    }
};




const getAllReviews = async () => {
    try {
        const reviews = await Review.findAll();
        console.log(reviews);
        return reviews;
    } catch (err) {
        throw new Error(err);
    }
};

const getReviewsByProductId = async (productId) => {
    try {
        const reviews = await Review.findAll({
            where: { productId },
        });
        return reviews;
    } catch (err) {
        throw new Error('Failed to retrieve reviews for product');
    }
};

export {
    createReview,
    getReviewById,
    updateReview,
    getAllReviews,
    getReviewsByProductId,
};
