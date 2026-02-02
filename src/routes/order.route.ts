import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getCurrentOrders,
    getOrderHistory,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/current", authMiddleware, getCurrentOrders);
router.get("/history", authMiddleware, getOrderHistory);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;