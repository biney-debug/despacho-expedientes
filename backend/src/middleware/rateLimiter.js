const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  // Reads real client IP from X-Forwarded-For regardless of proxy hop count (HF Spaces, Cloudflare, etc.)
  keyGenerator: (req) => {
    const xff = req.headers["x-forwarded-for"];
    if (xff) return xff.split(",")[0].trim();
    return req.socket.remoteAddress || "unknown";
  },
  message: {
    success: false,
    error: "Has realizado demasiadas consultas. Espera un momento e intenta nuevamente.",
  },
});
