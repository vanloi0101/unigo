import prisma from "../config/database.js";
import OrderService from "../services/OrderService.js";

// ==================== CREATE ORDER ====================
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    // Validation - Kiểm tra chi tiết hơn
    if (productId === undefined || productId === null || productId === "") {
      return res.status(400).json({
        status: "error",
        message: "productId là bắt buộc",
      });
    }

    if (quantity === undefined || quantity === null || quantity === "") {
      return res.status(400).json({
        status: "error",
        message: "quantity là bắt buộc",
      });
    }

    // Gọi OrderService để tạo đơn hàng
    const order = await OrderService.createOrder({
      userId,
      productId: parseInt(productId),
      quantity: parseInt(quantity),
    });

    res.status(201).json({
      status: "success",
      message: "Đơn hàng tạo thành công",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    // ==================== PHÂN LOẠI LỖI ====================

    // 1️⃣ Lỗi: Sản phẩm không tồn tại → 404
    if (error.message.includes("Sản phẩm không tồn tại")) {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }

    // 2️⃣ Lỗi: Không đủ tồn kho → 409 Conflict
    if (error.message.includes("Sản phẩm không đủ số lượng")) {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    // 3️⃣ Lỗi: Validation (quantity <= 0, userId/productId không hợp lệ) → 400
    if (
      error.message.includes("là bắt buộc") ||
      error.message.includes("phải lớn hơn")
    ) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    // 4️⃣ Lỗi hệ thống khác → 500
    console.error("⚠️ Unexpected error in createOrder:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi tạo đơn hàng",
    });
  }
};

// ==================== GET USER ORDERS ====================
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { userId },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.order.count({ where: { userId } });

    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy danh sách đơn hàng",
    });
  }
};

// ==================== GET ORDER BY ID ====================
export const getOrderById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
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
      return res.status(404).json({
        status: "error",
        message: "Đơn hàng không tìm thấy",
      });
    }

    // Check if the order belongs to the user (unless they are admin)
    if (order.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy thông tin đơn hàng",
    });
  }
};

// ==================== GET ALL ORDERS (ADMIN ONLY) ====================
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Chỉ admin mới có quyền truy cập",
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
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
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.order.count({ where });

    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy danh sách đơn hàng",
    });
  }
};

// ==================== UPDATE ORDER STATUS (ADMIN ONLY) ====================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Chỉ admin mới có quyền cập nhật trạng thái đơn hàng",
      });
    }

    // Validation: status bắt buộc
    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "status là bắt buộc",
      });
    }

    // Check valid status
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(", ")}`,
      });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);

    // Nếu không tìm thấy đơn hàng
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Đơn hàng không tìm thấy",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Lỗi server khi cập nhật trạng thái đơn hàng",
    });
  }
};
