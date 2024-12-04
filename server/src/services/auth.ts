import type { Request as ExpressRequest } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';
const expiration = '1h';

export const authenticateToken = ({ req }: { req: ExpressRequest }) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
      req.user = decodedToken;
    } catch (err) {
      console.log('Invalid or expired token');
    }
  }
  return req;
};

export const signToken = (user: { username: string; email: string; _id: string }) => {
  const payload = { username: user.username, email: user.email, _id: user._id };
  return jwt.sign(payload, secretKey, { expiresIn: expiration });
};