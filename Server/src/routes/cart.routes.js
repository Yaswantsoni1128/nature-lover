import express from "express";
import cartController from "../controllers/cart.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(validateJWT);

// Cart routes
router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateQuantity);
router.delete("/remove", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
