import express from "express";
import cors from "cors";
import config from "./config/env.js";
import prisma from "./config/database.js";

// ==================== Import Routes ====================
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// ==================== Middlewares ====================
// CORS configuration
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== Test Route ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// ==================== Database Connection Test ====================
app.get("/api/db-check", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "✅ Database connection successful!",
      database: "PostgreSQL",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Database connection failed!",
      error: error.message,
    });
  }
});

// ==================== API Routes ====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ==================== Error Handling ====================
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi máy chủ",
  });
});

// ==================== Start Server ====================
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`);
  console.log(`📍 Môi trường: ${config.NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${config.CORS_ORIGIN}`);
});

// ==================== 404 Handler ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
    path: req.path,
  });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==================== Start Server ====================
app.listen(config.PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║         🎨 Unigo - Backend API Server 🎨         ║
║        Mon Nho Handmade E-commerce Platform      ║
╚═══════════════════════════════════════════════════╝

✅ Server is running on: http://localhost:${config.PORT}
📍 Environment: ${config.NODE_ENV}
🔗 CORS Origin: ${config.CORS_ORIGIN}

Test the server:
  - Health Check: GET http://localhost:${config.PORT}/api/health
  - Database Check: GET http://localhost:${config.PORT}/api/db-check

  `);
});

export default app;
