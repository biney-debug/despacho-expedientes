# Registro de Decisiones de Arquitectura (ADR)

---

## ADR-001: Proxy backend obligatorio para llamadas a la API del DP

**Fecha:** 2026-06-12  
**Estado:** Aceptada  
**Autor:** Miguel Salas

### Contexto

El portal necesita consumir la API REST del Despacho Presidencial (`presidencia.gob.pe`). El frontend es HTML/CSS/JS puro servido desde nginx. Llamar a la API del DP directamente desde el navegador del ciudadano presenta dos problemas:

1. **CORS:** El servidor del DP no incluye headers `Access-Control-Allow-Origin` para dominios externos — el navegador bloquea la petición.
2. **Seguridad:** Exponer la URL exacta del endpoint del DP en el código JavaScript del cliente revela la arquitectura interna y facilita ataques de abuso o scraping.

### Decisión

Toda llamada a la API del DP pasa exclusivamente por el endpoint propio del backend:  
`POST /api/expedientes/consultar`

El frontend nunca hace fetch a `presidencia.gob.pe`. La URL de la API del DP se almacena en la variable de entorno `API_DP_URL` en el servidor.

### Consecuencias

- **Mayor control:** Podemos agregar caché, rate-limiting o reintentos en el backend sin modificar el frontend.
- **Sin exposición en cliente:** El ciudadano no puede ver ni abusar del endpoint real del DP.
- **CORS resuelto:** El backend hace la llamada server-to-server, sin restricciones de CORS.
- **Dependencia de entorno:** `API_DP_URL` debe estar configurada en `.env` antes de levantar el backend.
