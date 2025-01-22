import http from "http";
import { ApolloServer } from "@apollo/server";
import cors from "cors"
import express from "express";

import mergedResolvers from "./resolver/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

// Modified server startup
await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log(`🚀 Server ready at http://localhost:4000/`);