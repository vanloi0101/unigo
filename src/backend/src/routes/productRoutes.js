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
import { sendSuccess, sendError } from "../utils/responseHelper.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Temporary test route to verify multipart/form-data upload (no auth)
router.post('/test-upload', uploadSingle, (req, res) => {
  try {
    const body = req.body || {};
    const file = req.file
      ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    return sendSuccess(res, { body, file }, 'Test upload received');
  } catch (err) {
    return sendError(res, err);
  }
});

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
