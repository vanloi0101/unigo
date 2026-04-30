import rateLimit from "express-rate-limit";

// Export factory functions to create limiters at runtime. This ensures
// the Express `trust proxy` setting can be applied before the limiter
// instances are created (avoids ERR_ERL_UNEXPECTED_X_FORWARDED_FOR when
// deployed behind proxies like Railway).
export const createAuthLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 100 : 5,
  message: {
    success: false,
    message: "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const createApiLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Quá nhiều request, vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createStrictLimiter = () => rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 1 giờ.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
