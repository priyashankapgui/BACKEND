
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_SSL_CA,
  DATABASE_PORT
} = process.env;

<<<<<<< Updated upstream
// const certPath = path.resolve(DATABASE_SSL_CA);
// if (!fs.existsSync(certPath)) {
//   throw new Error(`SSL certificate not found at path: ${certPath}`);
// }
=======
// Check if all required environment variables are set
if (!DATABASE_HOST || !DATABASE_USERNAME || !DATABASE_PASSWORD || !DATABASE_NAME || !DATABASE_SSL_CA || !DATABASE_PORT) {
  throw new Error('One or more required environment variables are missing.');
}

const certPath = path.resolve(DATABASE_SSL_CA);

console.log(`Resolved SSL certificate path: ${certPath}`);

if (!fs.existsSync(certPath)) {
  throw new Error(`SSL certificate not found at path: ${certPath}`);
}
>>>>>>> Stashed changes

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: 'mysql',
  dialectOptions: {
    // ssl: {
    //   ca: fs.readFileSync(certPath),
    //   rejectUnauthorized: false
    // },
    connectTimeout: 60000,
    timezone: '+05:30',
  },
  timezone: '+05:30',
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  logging: console.log
});

export default sequelize;




// import dotenv from "dotenv";
// import { Sequelize } from 'sequelize';
// dotenv.config();

// const { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

// console.log(`Database Host: ${DATABASE_HOST}`);

// const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
//   host: DATABASE_HOST,
//   dialect: 'mysql',
// });

// export default sequelize;


