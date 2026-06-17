const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body?.usuario || "anonimo";
  },
  message: {
    success: false,
    error: "Has realizado demasiadas consultas sobre este expediente. Espera unos minutos e intenta de nuevo.",
  },
  skip: (req) => {
    return !req.body?.usuario;
  },
});

module.exports = limiter;
