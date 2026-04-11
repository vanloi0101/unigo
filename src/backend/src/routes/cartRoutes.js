import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  removeItem,
  updateItemQuantity,
  clearCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả các route cart đều cần JWT token
// POST /api/cart - Thêm sản phẩm vào giỏ hàng
router.post("/", authenticateToken, addToCart);

// GET /api/cart - Lấy thông tin giỏ hàng
router.get("/", authenticateToken, getCart);

// PUT /api/cart/items/:itemId - Cập nhật số lượng sản phẩm (không cần userId từ JWT)
router.put("/items/:itemId", updateItemQuantity);

// DELETE /api/cart/items/:itemId - Xóa sản phẩm khỏi giỏ hàng (không cần userId từ JWT)
router.delete("/items/:itemId", removeItem);

// DELETE /api/cart/:cartItemId - Xóa sản phẩm khỏi giỏ hàng
router.delete("/:cartItemId", authenticateToken, removeFromCart);

// PUT /api/cart/:cartItemId - Cập nhật số lượng sản phẩm (với xác minh userId)
router.put("/:cartItemId", authenticateToken, updateCartItem);

// DELETE /api/cart - Làm trống giỏ hàng
router.delete("/", authenticateToken, clearCart);

export default router;
