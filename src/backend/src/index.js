console.log("=== UNIGO BACKEND STARTING ===", new Date().toISOString());
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createApiLimiter } from "./middlewares/rateLimitMiddleware.js";
import config from "./config/env.js";
import prisma from "./config/database.js";

// ==================== Import Routes ====================
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();

// If the app is running behind a proxy (Railway, Heroku, etc.),
// enable trusting the first proxy so express-rate-limit and req.ip
// use the X-Forwarded-For header correctly.
app.set('trust proxy', 1);

// ==================== Security Middlewares ====================
// Helmet - Security headers (CSP, X-Frame-Options, etc.)
app.use(helmet({
  contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting - prevent brute force attacks
// Use factory so the limiter is created after `trust proxy` is set
const generalLimiter = createApiLimiter();

// ==================== CORS Configuration ====================
// FRONTEND_URLS can be a comma-separated list of allowed origins, e.g.
// FRONTEND_URLS="https://unigofe.vercel.app,https://unigo.id.vn"
const envFrontendUrls = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  config.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  ...envFrontendUrls,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Rate limiter — sau CORS để 429 vẫn trả đúng CORS headers
app.use(generalLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== Health Check (Always available) ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// ==================== Debug Routes (Development Only) ====================
if (config.NODE_ENV !== 'production') {
  // Database Connection Test - Only in development
  app.get("/api/db-check", async (req, res) => {
    try {
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

  // Environment Variables Check - Only in development
  app.get("/api/env-check", (req, res) => {
    try {
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
}

// ==================== API Routes ====================
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api", blogRoutes); // Blog/News routes (posts, categories, authors)

// ==================== 404 Handler ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
    // Don't expose path in production (security)
    ...(config.NODE_ENV !== 'production' && { path: req.path }),
  });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Don't expose error details in production
  const isProd = config.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    success: false,
    message: isProd ? "Internal Server Error" : (err.message || "Internal Server Error"),
    // Only include stack trace in development
    ...((!isProd && err.stack) && { stack: err.stack }),
  });
});

// ==================== Start Server ====================
const PORT = process.env.PORT || config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`);
  console.log(`📍 Môi trường: ${config.NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${config.CORS_ORIGIN}`);
});
