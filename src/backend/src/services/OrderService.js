import prisma from "../config/database.js";

class OrderService {
  /**
   * Tạo đơn hàng mới
   * @param {Object} payload - Payload chứa userId, productId, quantity
   * @returns {Object} - Order object vừa tạo
   * @throws {Error} - Nếu sản phẩm không tồn tại hoặc không đủ tồn kho
   */
  async createOrder(payload) {
    const { userId, productId, quantity } = payload;

    // ==================== VALIDATION ====================
    if (!userId || !productId || !quantity) {
      throw new Error("userId, productId, và quantity là bắt buộc");
    }

    if (quantity <= 0) {
      throw new Error("Số lượng phải lớn hơn 0");
    }

    // ==================== TÌM SẢN PHẨM ====================
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    // Kiểm tra sản phẩm có tồn tại không
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Kiểm tra tồn kho
    if (product.stock < quantity) {
      throw new Error(
        `Sản phẩm không đủ số lượng. Tồn kho: ${product.stock}, yêu cầu: ${quantity}`
      );
    }

    // ==================== TẠO ĐƠN HÀNG ====================
    try {
      // Tính tổng tiền
      const totalAmount = product.price * quantity;

      // Tạo đơn hàng trong transaction
      const order = await prisma.$transaction(async (tx) => {
        // Tạo đơn hàng
        const newOrder = await tx.order.create({
          data: {
            userId,
            totalAmount,
            status: "PENDING",
          },
        });

        // Tạo order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId,
            quantity,
            price: product.price,
          },
        });

        // Cập nhật stock sản phẩm
        await tx.product.update({
          where: { id: productId },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });

        return newOrder;
      });

      return order;
    } catch (error) {
      throw new Error(`Lỗi khi tạo đơn hàng: ${error.message}`);
    }
  }

  /**
   * Lấy thông tin chi tiết của đơn hàng
   * @param {number} orderId - ID đơn hàng
   * @returns {Object} - Order object với chi tiết items
   */
  async getOrderById(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    return order;
  }

  /**
   * Lấy tất cả đơn hàng của user
   * @param {number} userId - ID user
   * @returns {Array} - Danh sách đơn hàng của user
   */
  async getUserOrders(userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  }
}

export default new OrderService();
