import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { checkAdminRole } from "../middlewares/adminMiddleware.js";
import { uploadSingle, handleMulterError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (Admin only) with file upload
router.post(
  "/",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  updateProduct
);
router.delete("/:id", authenticateToken, checkAdminRole, deleteProduct);

export default router;
