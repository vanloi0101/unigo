// ==================== ADMIN AUTHORIZATION MIDDLEWARE ====================
export const checkAdminRole = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token không được cung cấp",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin mới có quyền truy cập endpoint này",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xác thực quyền admin",
      error: error.message,
    });
  }
};
