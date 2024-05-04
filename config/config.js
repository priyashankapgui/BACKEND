import dotenv from "dotenv";
dotenv.config();

export const SECRET = {
  SECRET_KEY: process.env.ACCESS_TOKEN_SECRET,
  
};
