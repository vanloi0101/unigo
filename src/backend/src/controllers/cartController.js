import cartService from "../services/cartService.js";

/**
 * Thêm sản phẩm vào giỏ hàng
 * POST /api/cart/add
 */
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.user; // Từ JWT middleware
    const { productId, quantity } = req.body;

    // Validation
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId và quantity là bắt buộc",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0",
      });
    }

    const cart = await cartService.addToCart(userId, productId, quantity);

    res.status(200).json({
      success: true,
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Lấy thông tin giỏ hàng
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.user; // Từ JWT middleware

    const cart = await cartService.getCart(userId);

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalPrice: 0, totalItems: 0 },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * DELETE /api/cart/:cartItemId
 */
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user; // Từ JWT middleware
    const { cartItemId } = req.params;

    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        message: "cartItemId là bắt buộc",
      });
    }

    const cart = await cartService.removeFromCart(
      userId,
      parseInt(cartItemId)
    );

    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Cập nhật số lượng CartItem
 * PUT /api/cart/:cartItemId
 */
export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.user; // Từ JWT middleware
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!cartItemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "cartItemId và quantity là bắt buộc",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không được âm",
      });
    }

    const cart = await cartService.updateCartItem(
      userId,
      parseInt(cartItemId),
      quantity
    );

    res.status(200).json({
      success: true,
      message:
        quantity === 0
          ? "Xóa sản phẩm khỏi giỏ hàng thành công"
          : "Cập nhật số lượng sản phẩm thành công",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Xóa một sản phẩm khỏi giỏ hàng (route riêng)
 * DELETE /api/cart/items/:itemId
 */
export const removeItem = async (req, res) => {
  try {
    const { userId } = req.user;
    const { itemId } = req.params;

    // Validation
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId là bắt buộc",
      });
    }

    const result = await cartService.removeFromCart(userId, parseInt(itemId));

    res.status(200).json({
      success: true,
      message: "XÃ³a sáº£n pháº©m khá»i giá» hÃ ng thÃ nh cÃ´ng",
      data: result,
    });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng (route riêng)
 * PUT /api/cart/items/:itemId
 */
export const updateItemQuantity = async (req, res) => {
  try {
    const { userId } = req.user;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId là bắt buộc",
      });
    }

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "quantity là bắt buộc",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không được âm",
      });
    }

    const result = await cartService.updateCartItem(
      userId,
      parseInt(itemId),
      quantity
    );

    res.status(200).json({
      success: true,
      message:
        quantity === 0
          ? "Sản phẩm đã được xóa khỏi giỏ hàng"
          : "Cập nhật số lượng sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    console.error("Update item quantity error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Làm trống giỏ hàng
 * DELETE /api/cart
 */
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.user; // Từ JWT middleware

    const result = await cartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};

/**
 * Đồng bộ giỏ hàng tạm (guest cart) với giỏ hàng của user
 * POST /api/cart/sync
 * Body: { items: [{ productId, quantity }] }
 */
export const syncCart = async (req, res) => {
  try {
    const { userId } = req.user; // Từ JWT middleware
    const { items } = req.body;

    // Validation
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "items phải là một mảng",
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách sản phẩm không được rỗng",
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'number') {
        return res.status(400).json({
          success: false,
          message: "productId phải là số",
        });
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "quantity phải là số lớn hơn 0",
        });
      }
    }

    const cart = await cartService.syncGuestCart(userId, items);

    res.status(200).json({
      success: true,
      message: `Đã đồng bộ ${items.length} sản phẩm vào giỏ hàng`,
      data: cart,
    });
  } catch (error) {
    console.error("Sync cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server",
    });
  }
};
