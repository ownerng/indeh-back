// src/infrastructure/http/server.ts
import express from 'express';
import cors from 'cors';
import { studentRoutes } from './routes/studentRoutes';
import { userRoutes } from './routes/userRoutes';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  });

  app.use('/api/students', studentRoutes);
  app.use('/api/auth', userRoutes);
  return app;
}