// services/reviewService.js

import Review from './review.js';

const createReview = async (reviewData) => {
    try {
        const review = await Review.create(reviewData);
        return review;
    } catch (err) {
        throw new Error('Failed to create review');
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

const updateReview = async (id, reviewData) => {
    try {
        const [updated] = await Review.update(reviewData, {
            where: { reviewId: id },
        });
        if (updated) {
            const updatedReview = await Review.findByPk(id);
            return updatedReview;
        }
        throw new Error('Review not found');
    } catch (err) {
        throw new Error('Failed to update review');
    }
};

const deleteReview = async (id) => {
    try {
        const deleted = await Review.destroy({
            where: { reviewId: id },
        });
        if (!deleted) {
            throw new Error('Review not found');
        }
    } catch (err) {
        throw new Error('Failed to delete review');
    }
};

const getAllReviews = async () => {
    try {
        const reviews = await Review.findAll();
        return reviews;
    } catch (err) {
        throw new Error('Failed to retrieve reviews');
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
    deleteReview,
    getAllReviews,
    getReviewsByProductId,
};
