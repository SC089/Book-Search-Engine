import type { Request, Response, NextFunction } from 'express';
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

export const authenticateToken = ({ req }: { req: Request }) => {
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

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: expiration });
};