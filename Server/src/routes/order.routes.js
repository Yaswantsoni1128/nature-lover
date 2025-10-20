import express from "express";
import orderController from "../controllers/order.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All order routes require authentication
router.use(validateJWT);

// Order routes
router.post("/create", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/stats", orderController.getOrderStats);
router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId/status", orderController.updateOrderStatus);
router.put("/:orderId/cancel", orderController.cancelOrder);

export default router;
