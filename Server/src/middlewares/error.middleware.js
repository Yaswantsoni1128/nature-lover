import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
    let error = err;
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ApiError(400, message);
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `${field} already exists`;
        error = new ApiError(400, message);
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ApiError(401, message);
    }
    
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new ApiError(401, message);
    }
    
    // Default error
    if (!(error instanceof ApiError)) {
        error = new ApiError(500, 'Internal Server Error');
    }
    
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

export default errorHandler;
