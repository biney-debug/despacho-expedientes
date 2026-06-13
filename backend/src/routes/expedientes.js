const express = require("express");
const router = express.Router();
const { validateConsulta } = require("../middleware/validate");
const { consultarExpediente } = require("../services/dpService");

router.post("/consultar", validateConsulta, async (req, res) => {
  const { usuario, clave } = req.body;

  const resultado = await consultarExpediente(usuario, clave);

  if (!resultado.success) {
    return res.status(resultado.status).json({ success: false, error: resultado.error });
  }

  return res.status(200).json({ success: true, data: resultado.data });
});

module.exports = router;
