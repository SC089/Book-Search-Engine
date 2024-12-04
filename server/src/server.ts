import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:300', 'http://localhost:3001'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start(); 

  app.use(
    '/graphql',
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        console.log('Auth Header (from context):', req.headers.authorization);
        authenticateToken({ req }); 
        return { user: (req as any).user }; // Pass authenticated user to context
      },
    })
  );

  if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../../client/dist');
    console.log('Serving static files from:', buildPath);

    app.use(express.static(buildPath));

    // Fallback for React frontend
    app.get('*', (_, res) => {
      res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).send(err);
        }
      });
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
