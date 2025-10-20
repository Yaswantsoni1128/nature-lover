import { ApiError } from '../utils/ApiError.js';

export const validateRegistration = (req, res, next) => {
    const { name, email, password, phone } = req.body;
    
    // Check required fields
    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            message: "All fields (name, email, password, phone) are required"
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }
    
    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
    }
    
    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            message: "Please enter a valid 10-digit phone number"
        });
    }
    
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }
    
    next();
};

export const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }
    
    next();
};

export const validateResetPassword = (req, res, next) => {
    const { token, password } = req.body;
    
    if (!token || !password) {
        return res.status(400).json({
            message: "Token and password are required"
        });
    }
    
    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
    }
    
    next();
};
