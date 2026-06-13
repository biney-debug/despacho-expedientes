# Referencia de API — Endpoints propios

## POST /api/expedientes/consultar

Consulta el estado de un expediente ante el Despacho Presidencial a través del proxy backend.

### Request

```http
POST /api/expedientes/consultar
Content-Type: application/json
```

```json
{
  "usuario": "2026-0010582",
  "clave": "4176"
}
```

### Respuesta exitosa (200)

```json
{
  "success": true,
  "data": {
    "numero_expediente": "2026-0010582",
    "tramite": "Solicitud de Audiencia Presidencial",
    "administrado": "Juan Pérez García",
    "estado_actual": "EN PROCESO",
    "detalle_estado": "En evaluación por la Secretaría General",
    "tiempo_estimado_resolucion_dias": 10,
    "ultima_actualizacion": "2026-06-10"
  }
}
```

### Errores

| Status | Causa | Respuesta |
|---|---|---|
| 400 | Campos `usuario` o `clave` faltantes | `{ "success": false, "error": "Debe ingresar el número de expediente y la clave de acceso" }` |
| 404 | Expediente no encontrado o clave incorrecta | `{ "success": false, "error": "Expediente no encontrado o clave incorrecta" }` |
| 502 | Error de comunicación con la API del DP | `{ "success": false, "error": "Error al comunicarse con el Despacho Presidencial" }` |
| 503 | API del DP no disponible | `{ "success": false, "error": "El servicio del Despacho Presidencial no está disponible en este momento" }` |

### Estados posibles del expediente

| Estado | Descripción |
|---|---|
| `DOCUMENTO REGISTRADO` | El expediente fue recibido y registrado |
| `EN PROCESO` | En evaluación por el área correspondiente |
| `SE EMITIO RESPUESTA` | El Despacho emitió una respuesta formal |
