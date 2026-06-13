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

app.get("/", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>API Proxy - Despacho Presidencial</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 2rem; color: #1a1a1a; }
          main { max-width: 720px; }
          code { background: #f4f6f9; border: 1px solid #d0d7e3; border-radius: 6px; padding: 0.15rem 0.35rem; }
          a { color: #1a3c6e; font-weight: 700; }
        </style>
      </head>
      <body>
        <main>
          <h1>API Proxy - Despacho Presidencial</h1>
          <p>Backend activo. Esta API no tiene una pantalla de usuario en este puerto.</p>
          <p>Documentacion interactiva: <a href="/api-docs">/api-docs</a></p>
          <p>Endpoint principal: <code>POST /api/expedientes/consultar</code></p>
          <p>Portal ciudadano: <a href="http://localhost:8080">http://localhost:8080</a></p>
        </main>
      </body>
    </html>
  `);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/expedientes", expedientesRouter);

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
