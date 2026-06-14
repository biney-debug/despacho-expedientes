---
title: Despacho Expedientes Backend
emoji: 📄
colorFrom: red
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# Despacho Presidencial — API Proxy

Proxy seguro para consulta de expedientes ante el Despacho Presidencial.
Hackaton TransformaGob 2026 — Equipo 1500.

- Endpoint principal: `POST /api/expedientes/consultar`
- Documentación interactiva: `/api-docs`
- Frontend del portal ciudadano: desplegado por separado en Vercel

## Variables de entorno requeridas

Configurar en **Settings → Variables and secrets** de este Space:

| Variable | Descripción |
|---|---|
| `API_DP_URL` | URL del endpoint real del Despacho Presidencial |
| `PORT` | `7860` (puerto esperado por Hugging Face Spaces) |
| `CORS_ORIGIN` | Origen(es) permitidos, separados por coma (ej. URL de Vercel) |
| `RATE_LIMIT_MAX` | Límite de peticiones por minuto por IP (por defecto `20`) |
