import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getUserOrders);
// Admin only routes
router.get("/admin/all", authenticateToken, getAllOrders);
router.put("/:id/status", authenticateToken, updateOrderStatus);
router.get("/:id", authenticateToken, getOrderById);

export default router;
