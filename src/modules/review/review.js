import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import products from '../product/product.js';

const Review = sequelize.define('Review', {
    reviewId: {
        type: DataTypes.STRING,
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
        type: DataTypes.VIRTUAL,
        get() {
            const total =
                (this.oneStar || 0) +
                (this.twoStars || 0) * 2 +
                (this.threeStars || 0) * 3 +
                (this.fourStars || 0) * 4 +
                (this.fiveStars || 0) * 5;
            return total;
        },
    },
    numberOfReviews: {
        type: DataTypes.VIRTUAL,
        get() {
            return (
                (this.oneStar || 0) +
                (this.twoStars || 0) +
                (this.threeStars || 0) +
                (this.fourStars || 0) +
                (this.fiveStars || 0)
            );
        },
    },
    averageRating: {
        type: DataTypes.VIRTUAL,
        get() {
            const totalStars = this.totalStars;
            const numberOfReviews = this.numberOfReviews;
            return numberOfReviews ? totalStars / numberOfReviews : 0;
        },
    },
});

Review.belongsTo(products, { foreignKey: 'productId' });

export default Review;
