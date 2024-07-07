import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import bcrypt from 'bcryptjs';
import ShoppingCart from '../cart_Customer/shoppingcart.js';

const Customer = sequelize.define('customer', {
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Email already associated with an account",
          },
        validate: {
            isEmail: {
                args: true,
                msg: "Email address is invalid"
            },
        },

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^((\+94)[0-9]{9}|(0)[0-9]{9})$/,
                msg: "Phone number is invalid"
            },
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shoppingcartCartId: {
        type: DataTypes.INTEGER,
        references: {
            model: ShoppingCart,
            key: 'cartId'
        },
    },
}, {
    tableName: 'customer',
    hooks: {
        async beforeSave(customer) {
            if (customer.changed('password')) {
                const saltRounds = bcrypt.genSaltSync(10); 
                customer.password = await bcrypt.hash(customer.password, saltRounds);
            }
        },
        async beforeCreate(customer) {
            const cart = await ShoppingCart.create({});
            customer.cartId = cart.cartId;
        }
    },
});

export default Customer;
