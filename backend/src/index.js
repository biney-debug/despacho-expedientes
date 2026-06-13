require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const expedientesRouter = require("./routes/expedientes");

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Despacho Presidencial — API Proxy",
    version: "1.0.0",
    description: "Proxy seguro para consulta de expedientes ante el Despacho Presidencial. Hackaton TransformaGob 2026 — Equipo 1500.",
  },
  paths: {
    "/api/expedientes/consultar": {
      post: {
        summary: "Consultar estado de expediente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["usuario", "clave"],
                properties: {
                  usuario: { type: "string", example: "2026-0010582" },
                  clave: { type: "string", example: "4176" },
                },
              },
              examples: {
                "EN PROCESO (Audiencia)": { value: { usuario: "2026-0010582", clave: "4176" } },
                "DOCUMENTO REGISTRADO (Petición)": { value: { usuario: "2026-0003984", clave: "2851" } },
                "SE EMITIO RESPUESTA (Recurso)": { value: { usuario: "2026-0012476", clave: "9634" } },
                "EN PROCESO (Denuncia)": { value: { usuario: "2026-0004721", clave: "1548" } },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Expediente encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        numero_expediente: { type: "string" },
                        tramite: { type: "string" },
                        administrado: { type: "string" },
                        estado_actual: { type: "string", enum: ["DOCUMENTO REGISTRADO", "EN PROCESO", "SE EMITIO RESPUESTA"] },
                        detalle_estado: { type: "string" },
                        tiempo_estimado_resolucion_dias: { type: "integer" },
                        ultima_actualizacion: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Campos faltantes" },
          404: { description: "Expediente no encontrado o clave incorrecta" },
          503: { description: "API del Despacho Presidencial no disponible" },
        },
      },
    },
  },
};

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/expedientes", expedientesRouter);

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
