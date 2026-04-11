import { ZodError } from "zod";

/**
 * Middleware to validate request data against a Zod schema
 * @param {ZodSchema} schema - The Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body against schema
      const validatedData = schema.parse(req.body);

      // Replace req.body with validated and sanitized data
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract error messages from Zod validation errors
        const errors = error.issues.map((issue) => ({
          field: issue.path.join(".") || "general",
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Lỗi xác thực đầu vào",
          errors: errors,
          timestamp: new Date().toISOString(),
        });
      }

      // Unexpected error
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xác thực",
        error: error.message,
      });
    }
  };
};
