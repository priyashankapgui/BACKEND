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


const updateReview = async (productId, reviewData) => {
    try {
        // Retrieve the existing review data for the product
        const existingReview = await Review.findOne({
            where: { productId: productId },
        });

        if (!existingReview) {
            createReview(reviewData);
        }

        // Update the values by adding the new data to the existing data
        const updatedOneStar = (existingReview.oneStar || 0) + (reviewData.oneStar || 0);
        const updatedTwoStars = (existingReview.twoStars || 0) + (reviewData.twoStars || 0);
        const updatedThreeStars = (existingReview.threeStars || 0) + (reviewData.threeStars || 0);
        const updatedFourStars = (existingReview.fourStars || 0) + (reviewData.fourStars || 0);
        const updatedFiveStars = (existingReview.fiveStars || 0) + (reviewData.fiveStars || 0);

        // Calculate totalStars, numberOfReviews, and averageRating
        const totalStars = 
            updatedOneStar * 1 +
            updatedTwoStars * 2 +
            updatedThreeStars * 3 +
            updatedFourStars * 4 +
            updatedFiveStars * 5;
        const numberOfReviews =
            updatedOneStar +
            updatedTwoStars +
            updatedThreeStars +
            updatedFourStars +
            updatedFiveStars;
        const averageRating = numberOfReviews ? totalStars / numberOfReviews : 0;

        // Update the review data
        const updatedReviewData = {
            oneStar: updatedOneStar,
            twoStars: updatedTwoStars,
            threeStars: updatedThreeStars,
            fourStars: updatedFourStars,
            fiveStars: updatedFiveStars,
            totalStars: totalStars,
            numberOfReviews: numberOfReviews,
            averageRating: averageRating,
        };

        await existingReview.update(updatedReviewData);

        // Retrieve the updated review
        const updatedReview = await Review.findOne({
            where: { productId: productId },
        });

        return updatedReview;
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
        if (reviews.length === 0) {
            throw new Error('No reviews found for the product');
            
        }
        return reviews;
    } catch (err) {
        console.log(err);
        throw new Error('Failed to retrieve reviews for product');
    }
};


export {
    createReview,
    updateReview,
    getAllReviews,
    getReviewsByProductId,
};
