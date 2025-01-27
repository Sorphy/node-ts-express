import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken: any = function generate(user: string) {
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      throw new Error("TOKEN_SECRET environment variable is not set");
    }
    const tokenExpiry: any = process.env.TOKEN_EXPIRY || '1h';
    return jwt.sign({ data: user }, tokenSecret, {expiresIn: tokenExpiry});
};

export default generateToken;