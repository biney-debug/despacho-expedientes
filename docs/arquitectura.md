# Arquitectura del Sistema

## Diagrama

```
Ciudadano (celular/browser)
        |
        | HTTP GET
        v
  ┌─────────────┐
  │  Frontend   │  HTML/CSS/JS vanilla — nginx (puerto 8080)
  │  index.html │  Mobile-first, 375px base
  └──────┬──────┘
         |
         | POST /api/expedientes/consultar
         | { usuario, clave }
         v
  ┌─────────────┐
  │   Backend   │  Node.js + Express (puerto 3000)
  │   (proxy)   │  validate.js → routes → dpService.js
  └──────┬──────┘
         |
         | POST (API_DP_URL)
         | { usuario, clave }
         v
  ┌──────────────────────────────────┐
  │  API oficial Despacho Presidencial│  presidencia.gob.pe
  │  /api/consulta-expedientes/      │  (NUNCA llamada directamente
  │  index.php                       │   desde el frontend)
  └──────────────────────────────────┘
```

## Principios de diseño

- **Proxy obligatorio:** El frontend nunca llama directamente a la API del DP. Ver ADR-001 en `decisiones.md`.
- **Separación de capas:** `routes/` → routing; `services/` → lógica externa; `middleware/` → validación.
- **Sin secretos en código:** Toda URL o credencial va en variables de entorno.
- **Mobile-first:** Base CSS en 375px, breakpoints hacia arriba.

## Constancia de consulta

Tras una consulta exitosa, `frontend/js/app.js` genera una **constancia imprimible** en una pestaña nueva mediante `window.open()` + `window.print()`. Es un documento HTML autocontenido (estilos inline, sin dependencias externas) con los datos de la consulta (expediente, trámite, estado, fecha/hora). No involucra al backend ni genera archivos en el servidor: todo ocurre en el cliente, en el momento de la consulta.
