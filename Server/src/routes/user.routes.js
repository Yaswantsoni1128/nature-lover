import express from "express"
import userController from "../controllers/user.controller.js"
import { validateJWT } from "../middlewares/auth.middleware.js"
import { 
    validateRegistration, 
    validateLogin, 
    validateForgotPassword, 
    validateResetPassword 
} from "../middlewares/validation.middleware.js"

const router= express.Router();

// PUBLIC ROUTES
router.post("/register", validateRegistration, userController.register);
router.post("/login", validateLogin, userController.login);
router.post("/refresh-token", userController.refreshAccessToken);
router.post("/logout", userController.logout);
router.post("/forgot-password", validateForgotPassword, userController.forgotPassword);
router.post("/reset-password", validateResetPassword, userController.resetPassword);

// PROTECTED ROUTES USED VALIDATOR
router.get("/me", validateJWT, userController.getCurrentUser);
router.put("/me", validateJWT, userController.updateCurrentUser);
router.delete("/me", validateJWT, userController.deleteUser);

export default router;