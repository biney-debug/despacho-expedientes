function validateConsulta(req, res, next) {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({
      success: false,
      error: "Debe ingresar el número de expediente y la clave de acceso",
    });
  }

  next();
}

module.exports = { validateConsulta };
