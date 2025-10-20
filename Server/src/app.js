import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';
import userRouter from "./routes/user.routes.js";
import contactRouter from "./routes/contact.routes.js";

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Static files
app.use(express.static('public'));

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export {app}