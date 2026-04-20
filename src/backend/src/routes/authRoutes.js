import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";

const router = express.Router();

// Public routes (with rate limiting to prevent brute force)
router.post("/register", authLimiter, validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.post("/logout", authenticateToken, logout);

export default router;
