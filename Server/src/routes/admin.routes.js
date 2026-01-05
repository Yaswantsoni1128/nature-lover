import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllUsers,
  getUserDetails,
  getDashboardStats,
  deleteOrder
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// All routes require admin authentication
router.use(verifyAdmin);

// Dashboard
router.route("/stats").get(getDashboardStats);

// Orders management
router.route("/orders").get(getAllOrders);
router.route("/orders/:orderId").get(getOrderById);
router.route("/orders/:orderId/status").patch(updateOrderStatus);
router.route("/orders/:orderId").delete(deleteOrder);

// Users management
router.route("/users").get(getAllUsers);
router.route("/users/:userId").get(getUserDetails);

export default router;
