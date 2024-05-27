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

const certPath = path.resolve(DATABASE_SSL_CA);
if (!fs.existsSync(certPath)) {
  throw new Error(`SSL certificate not found at path: ${certPath}`);
}

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(certPath),
      rejectUnauthorized: false
    },
    connectTimeout: 60000 
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, 
    idle: 10000
  },
  logging: console.log 
});

<<<<<<< Updated upstream
export default sequelize;
=======


export default sequelize;

// import  Sequelize  from 'sequelize';
// const {DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

// const sequelize = new Sequelize('cms', 'root', 'pass123', {
//   host: 'localhost',
//   dialect: 'mysql',
// });



// export default sequelize;
>>>>>>> Stashed changes
