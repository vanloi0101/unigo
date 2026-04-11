// Utilities to standardize API responses across controllers
// Exports: sendSuccess, sendCreated, sendError, sendValidationError, sendNotFound

const makePayload = (success, message, data, statusCode) => ({
  success,
  message: message || (success ? "Success" : "Error"),
  data: data === undefined ? null : data,
  statusCode,
});

export function sendSuccess(res, data = null, message = "OK", statusCode = 200) {
  return res.status(statusCode).json(makePayload(true, message, data, statusCode));
}

export function sendCreated(res, data = null, message = "Created") {
  return res.status(201).json(makePayload(true, message, data, 201));
}

export function sendError(res, errorOrMessage = "Internal Server Error", statusCode = 500, data = null) {
  const message = typeof errorOrMessage === "string" ? errorOrMessage : (errorOrMessage && errorOrMessage.message) || "Internal Server Error";
  return res.status(statusCode).json(makePayload(false, message, data, statusCode));
}

export function sendValidationError(res, errorMessage = "Validation failed", details = null) {
  const statusCode = 400;
  const data = details || null;
  return res.status(statusCode).json(makePayload(false, errorMessage, data, statusCode));
}

export function sendNotFound(res, message = "Not Found") {
  const statusCode = 404;
  return res.status(statusCode).json(makePayload(false, message, null, statusCode));
}

export default {
  sendSuccess,
  sendCreated,
  sendError,
  sendValidationError,
  sendNotFound,
};
