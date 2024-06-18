import dotenv from "dotenv";
dotenv.config();

export const SECRET = {
  SECRET_KEY: process.env.ACCESS_TOKEN_SECRET, 
};

export const AUTH = {
  MAX_FAILED_ATTEMPTS: process.env.MAX_FAILED_ATTEMPTS,
  FAILED_ATTEMPT_TIMEOUT: process.env.FAILED_ATTEMPT_TIMEOUT,
}
