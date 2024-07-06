import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import products from '../product/product.js';

const Review = sequelize.define('Review', {
    reviewId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: products,
          key: 'productId',
        },
    },
    oneStar: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    twoStars: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    threeStars: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fourStars: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fiveStars: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    totalStars: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    hooks: {
        async beforeSave(review) {
            console.log('Before save hook execution:', review.toJSON());

            const totalStars =
                (review.oneStar || 0)*1 +
                (review.twoStars || 0) * 2 +
                (review.threeStars || 0) * 3 +
                (review.fourStars || 0) * 4 +
                (review.fiveStars || 0) * 5;
            const numberOfReviews =
                (review.oneStar || 0) +
                (review.twoStars || 0) +
                (review.threeStars || 0) +
                (review.fourStars || 0) +
                (review.fiveStars || 0);
            const averageRating = numberOfReviews ? totalStars / numberOfReviews : 0;

            // Update the instance with calculated values
            review.totalStars = totalStars;
            review.setDataValue('numberOfReviews', numberOfReviews); // Use setDataValue for virtual fields
            review.setDataValue('averageRating', averageRating); // Use setDataValue for virtual fields
        },
    },
}
);

Review.belongsTo(products, { foreignKey: 'productId' });

export default Review;