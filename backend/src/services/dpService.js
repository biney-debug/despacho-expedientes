const axios = require("axios");

async function consultarExpediente(usuario, clave) {
  const url = process.env.API_DP_URL;

  if (!url) {
    return { success: false, status: 500, error: "API_DP_URL no configurada en el servidor" };
  }

  try {
    const response = await axios.post(
      url,
      { usuario, clave },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    const body = response.data;

    if (body.codigo_estado !== 200 || !body.data) {
      return { success: false, status: 404, error: "Expediente no encontrado o clave incorrecta" };
    }

    return { success: true, data: body.data };
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if ([401, 403, 404].includes(status)) {
        return { success: false, status: 404, error: "Expediente no encontrado o clave incorrecta" };
      }
      return { success: false, status: 502, error: "Error al comunicarse con el Despacho Presidencial" };
    }
    return { success: false, status: 503, error: "El servicio del Despacho Presidencial no está disponible en este momento" };
  }
}

module.exports = { consultarExpediente };
