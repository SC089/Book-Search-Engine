import type { Request as ExpressRequest } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || 'defaultsecret';
const expiration = '1h';

export const authenticateToken = ({ req }: { req: ExpressRequest }) => {
  const authHeader = req.headers.authorization;

  console.log('Auth header:', authHeader);

  if (!authHeader) {
    console.warn('No authorization header provided.');
    req.user = null;
    return req;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    (req as any).user = decodedToken;
    console.log('Decoded Token:', decodedToken);
  } catch (err) {
    console.error('Invalid or expired token:', err);
    (req as any).user = null;
  }
  
  return req;
};

export const signToken = (user: { username: string; email: string; _id: string }) => {
  const payload = { username: user.username, email: user.email, _id: user._id };
  return jwt.sign(payload, secretKey, { expiresIn: expiration });
};