import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { uploadSingle, handleMulterError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (Admin only) with file upload
router.post(
  "/",
  authenticateToken,
  uploadSingle,
  handleMulterError,
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  uploadSingle,
  handleMulterError,
  updateProduct
);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;
