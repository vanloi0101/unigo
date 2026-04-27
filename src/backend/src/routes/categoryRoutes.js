import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { checkAdminRole } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Protected routes (Admin only)
router.post(
  "/",
  authenticateToken,
  checkAdminRole,
  createCategory
);

router.put(
  "/:id",
  authenticateToken,
  checkAdminRole,
  updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  checkAdminRole,
  deleteCategory
);

// Bulk reorder
router.post(
  "/reorder/bulk",
  authenticateToken,
  checkAdminRole,
  reorderCategories
);

export default router;
