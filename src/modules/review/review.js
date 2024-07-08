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
});

Review.belongsTo(products, { foreignKey: 'productId' });

export default Review;
