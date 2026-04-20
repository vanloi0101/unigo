import rateLimit from "express-rate-limit";

// ==================== AUTH RATE LIMITER ====================
// Strict rate limit for authentication endpoints (login, register)
// Prevents brute force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 attempts per windowMs
  message: {
    success: false,
    message: "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// ==================== API RATE LIMITER ====================
// General rate limit for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Quá nhiều request, vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== STRICT RATE LIMITER ====================
// Very strict rate limit for sensitive operations (password reset, etc.)
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 attempts per hour
  message: {
    success: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 1 giờ.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
