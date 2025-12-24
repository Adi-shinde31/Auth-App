import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'
import { authRouter } from './routes/authRoutes.js'
import { userRouter } from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const allowedOrigins = ['https://adityashinde-auth-app.onrender.com']

app.use(express.json()); // Parses JSON data from request bodies (req.body)
app.use(cookieParser()); // Reads cookies from incoming requests (req.cookies)
app.use(cors({origin: allowedOrigins, credentials: true})); // Allows cross-origin requests and cookies/auth headers from frontend

// API Endpoints
app.get('/', (req, res) => {
    res.send('API Working');
})
app.use('/api/auth', authRouter) // handles auth endpoints
app.use('/api/user', userRouter) // handles user-related endpoints

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})