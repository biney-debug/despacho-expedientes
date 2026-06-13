// Turno 2 (Franck): implementar formulario de búsqueda y línea de tiempo de estados
// Endpoint del proxy: POST /api/expedientes/consultar
// Body: { usuario: "2026-XXXXXXX", clave: "XXXX" }
// Respuesta exitosa: { success: true, data: { numero_expediente, tramite, administrado,
//   estado_actual, detalle_estado, tiempo_estimado_resolucion_dias, ultima_actualizacion } }
// Estados posibles: "DOCUMENTO REGISTRADO" | "EN PROCESO" | "SE EMITIO RESPUESTA"
