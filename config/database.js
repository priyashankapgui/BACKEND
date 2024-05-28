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

// const certPath = path.resolve(DATABASE_SSL_CA);
// if (!fs.existsSync(certPath)) {
//   throw new Error(`SSL certificate not found at path: ${certPath}`);
// }

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: 'mysql',
});

export default sequelize;
