import express from "express";
import cors from "cors";
import config from "./config/env.js";
import prisma from "./config/database.js";

// ==================== Import Routes ====================
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

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

// ==================== Environment Variables Check ====================
app.get("/api/env-check", (req, res) => {
  try {
    // Check all required environment variables (without exposing sensitive values)
    const requiredEnvVars = {
      PORT: config.PORT,
      NODE_ENV: config.NODE_ENV,
      CORS_ORIGIN: config.CORS_ORIGIN,
      JWT_EXPIRE: process.env.JWT_EXPIRE,
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ Configured" : "❌ Missing",
    };

    const allConfigured = Object.values(requiredEnvVars).every(
      (val) => val !== "❌ Missing"
    );

    res.status(allConfigured ? 200 : 500).json({
      success: allConfigured,
      message: allConfigured
        ? "✅ All environment variables are properly configured!"
        : "⚠️ Some environment variables are missing!",
      environment: requiredEnvVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Environment check failed:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Environment check failed!",
      error: error.message,
    });
  }
});

// ==================== API Routes ====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

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
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`);
  console.log(`📍 Môi trường: ${config.NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${config.CORS_ORIGIN}`);
});
