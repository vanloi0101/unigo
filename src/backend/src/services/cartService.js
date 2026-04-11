import prisma from "../config/database.js";

class CartService {
  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {number} userId - ID của user
   * @param {number} productId - ID của sản phẩm
   * @param {number} quantity - Số lượng muốn thêm
   * @returns {Promise<Object>} - Dữ liệu giỏ hàng sau khi cập nhật
   */
  async addToCart(userId, productId, quantity) {
    try {
      // Bước 1: Tìm hoặc tạo Cart cho user
      let cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId,
          },
        });
      }

      // Bước 2: Kiểm tra xem CartItem với productId này đã tồn tại chưa
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      // Bước 3: Cập nhật hoặc tạo CartItem
      if (existingCartItem) {
        // Nếu đã tồn tại: cập nhật tăng quantity
        await prisma.cartItem.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + quantity,
          },
        });
      } else {
        // Nếu chưa tồn tại: tạo CartItem mới
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      // Bước 4: Trả về dữ liệu giỏ hàng đầy đủ
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return updatedCart;
    } catch (error) {
      throw new Error(`Lỗi khi thêm sản phẩm vào giỏ hàng: ${error.message}`);
    }
  }

  /**
   * Lấy thông tin giỏ hàng của user
   * @param {number} userId - ID của user
   * @returns {Promise<Object>} - Dữ liệu giỏ hàng
   */
  async getCart(userId) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return cart;
    } catch (error) {
      throw new Error(`Lỗi khi lấy giỏ hàng: ${error.message}`);
    }
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {number} userId - ID của user
   * @param {number} cartItemId - ID của CartItem
   * @returns {Promise<Object>} - Dữ liệu giỏ hàng sau khi xóa
   */
  async removeFromCart(userId, cartItemId) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new Error("Giỏ hàng không tồn tại");
      }

      await prisma.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return updatedCart;
    } catch (error) {
      throw new Error(`Lỗi khi xóa sản phẩm khỏi giỏ hàng: ${error.message}`);
    }
  }

  /**
   * Cập nhật số lượng CartItem
   * @param {number} userId - ID của user
   * @param {number} cartItemId - ID của CartItem
   * @param {number} quantity - Số lượng mới
   * @returns {Promise<Object>} - Dữ liệu giỏ hàng sau khi cập nhật
   */
  async updateCartItem(userId, cartItemId, quantity) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new Error("Giỏ hàng không tồn tại");
      }

      // Kiểm tra CartItem thuộc về cart này
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cartId: cart.id,
        },
      });

      if (!cartItem) {
        throw new Error("CartItem không tồn tại trong giỏ hàng của bạn");
      }

      if (quantity <= 0) {
        // Nếu quantity <= 0, xóa CartItem
        await prisma.cartItem.delete({
          where: { id: cartItemId },
        });
      } else {
        // Cập nhật quantity
        await prisma.cartItem.update({
          where: { id: cartItemId },
          data: { quantity },
        });
      }

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return updatedCart;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật CartItem: ${error.message}`);
    }
  }

  /**
   * Cập nhật số lượng CartItem (dùng cho route riêng)
   * @param {number} cartItemId - ID của CartItem
   * @param {number} quantity - Số lượng mới
   * @returns {Promise<Object>} - CartItem sau khi cập nhật hoặc xóa
   */
  async updateItemQuantity(cartItemId, quantity) {
    try {
      // Kiểm tra quantity hợp lệ
      if (quantity < 0) {
        throw new Error("Số lượng không được âm");
      }

      // Tìm CartItem hiện tại
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (!cartItem) {
        throw new Error("CartItem không tồn tại");
      }

      // Nếu quantity = 0, xóa CartItem
      if (quantity === 0) {
        await prisma.cartItem.delete({
          where: { id: cartItemId },
        });
        return {
          success: true,
          message: "Sản phẩm đã được xóa khỏi giỏ hàng",
          deleted: true,
        };
      }

      // Nếu quantity > 0, cập nhật
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
        include: {
          product: true,
        },
      });

      return updatedItem;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật số lượng sản phẩm: ${error.message}`);
    }
  }

  /**
   * Xóa một CartItem khỏi giỏ hàng
   * @param {number} cartItemId - ID của CartItem
   * @returns {Promise<Object>} - Kết quả xóa
   */
  async removeCartItem(cartItemId) {
    try {
      // Kiểm tra CartItem có tồn tại không
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (!cartItem) {
        throw new Error("CartItem không tồn tại");
      }

      // Xóa CartItem
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return {
        success: true,
        message: "Sản phẩm đã được xóa khỏi giỏ hàng",
      };
    } catch (error) {
      throw new Error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  }

  /**
   * Làm trống giỏ hàng
   * @param {number} userId - ID của user
   * @returns {Promise<Object>} - Kết quả
   */
  async clearCart(userId) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new Error("Giỏ hàng không tồn tại");
      }

      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { success: true, message: "Giỏ hàng đã được làm trống" };
    } catch (error) {
      throw new Error(`Lỗi khi làm trống giỏ hàng: ${error.message}`);
    }
  }
}

export default new CartService();
