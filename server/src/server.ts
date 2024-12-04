import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { Request as ExpressRequest } from 'express';

import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js'; 
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

console.log('typeDefs', typeDefs);
console.log('resolvers', resolvers);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: ExpressContextFunctionArgument) => {
        return { req: authenticateToken({ req: req as ExpressRequest }) };
      }
    })
  );

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
    });
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});


