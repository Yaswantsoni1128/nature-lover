import express from "express";
import contactController from "../controllers/contact.controller.js";
import { validateContactForm } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Contact form submission
router.post("/send-message", validateContactForm, contactController.sendMessage);

export default router;
