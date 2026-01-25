import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import { authRouter } from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';

const app = express();

// Trust Vercel proxy
app.set('trust proxy', 1);

// const port = process.env.PORT || 3000;

// Allowed frontend origin
const allowedOrigin = process.env.ALLOWED_ORIGIN;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.get('/', (req, res) => {
  res.send('API Working');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Connect to MongoDB 
// DB connection (important: do NOT listen here)
connectDB();

export default app;