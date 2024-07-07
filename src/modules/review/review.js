import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import products from '../product/product.js';

const Review = sequelize.define('Review', {
    reviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
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
    numberOfReviews: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
// }, {
//     hooks: {
//         async beforeSave(review) {
//             console.log('Before save hook execution:', review.toJSON());

//             const totalStars =
//                 (review.oneStar || 0) * 1 +
//                 (review.twoStars || 0) * 2 +
//                 (review.threeStars || 0) * 3 +
//                 (review.fourStars || 0) * 4 +
//                 (review.fiveStars || 0) * 5;
//             const numberOfReviews =
//                 (review.oneStar || 0) +
//                 (review.twoStars || 0) +
//                 (review.threeStars || 0) +
//                 (review.fourStars || 0) +
//                 (review.fiveStars || 0);
//             const averageRating = numberOfReviews ? totalStars / numberOfReviews : 0;

//             review.totalStars = totalStars;
//             review.setDataValue('numberOfReviews', numberOfReviews);
//             review.setDataValue('averageRating', averageRating);
//         },
//     },
  
});

Review.belongsTo(products, { foreignKey: 'productId' });

export default Review;
