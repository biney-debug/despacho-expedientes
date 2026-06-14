# Despacho Presidencial — Consulta de Expedientes

**Hackaton TransformaGob 2026 | Desafío 16 | Equipo 1500**

## Descripción

Portal web para que ciudadanos peruanos consulten el estado de su expediente ante el Despacho Presidencial desde cualquier celular, sin instalar apps, sin depender de horarios de atención.

## Equipo

| Integrante | Rol |
|---|---|
| Miguel Salas | Líder, backend, estructura base |
| Franck Panduro | Frontend: formulario y línea de tiempo |
| Antuaneth Angulo | Frontend: orientación y accesibilidad |
| Cristina Sihuas | UX/UI, responsive, pruebas |
| Carlos Zegarra | Despliegue, constancia, docs finales |

## Stack

- **Backend:** Node.js 18+ / Express / axios / dotenv
- **Frontend:** HTML5 / CSS3 vanilla / JavaScript ES6+ (mobile-first, sin libs externas)
- **Infraestructura:** Docker Compose (backend Node + frontend nginx)
- **API externa:** Despacho Presidencial (integración via proxy propio)

## Despliegue en 3 pasos

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/biney-debug/despacho-expedientes.git
cd despacho-expedientes

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y completar: API_DP_URL (y opcionalmente PORT, CORS_ORIGIN, RATE_LIMIT_MAX)

# 3. Levantar con Docker Compose
docker compose up
# Backend: http://localhost:3000
# Frontend: http://localhost:8080
```

No se requiere instalar Node.js ni dependencias manualmente: la imagen del backend instala todo durante el build de `docker compose up`.

### Desarrollo local sin Docker (opcional)

```bash
cd backend && npm install && npm run dev
```

## Flujo de contribución (relay entre turnos)

1. `git pull origin dev` antes de escribir cualquier línea
2. Resolver conflictos localmente (nunca force push)
3. Completar la tarea asignada
4. Commit convencional en español (ver formato abajo)
5. `git push origin dev`
6. Notificar al siguiente integrante

## Formato de commits convencionales

```
tipo(alcance): descripción en modo imperativo
```

**Tipos:** `feat` `fix` `docs` `style` `refactor` `chore` `test`

**Ejemplos:**
```
feat(expedientes): agregar endpoint proxy de consulta al Despacho Presidencial
fix(api): corregir manejo de error 400 cuando la clave es incorrecta
docs(readme): documentar instrucciones de instalación y variables de entorno
chore(docker): agregar docker-compose.yml con backend y frontend
```

## Seguridad

`.env` **nunca se commitea**. Está en `.gitignore` desde el primer commit.  
Las credenciales de prueba de la API del DP no van en el código fuente. La URL de integración se configura únicamente con la variable `API_DP_URL`.

### Rate Limiting

El endpoint `POST /api/expedientes/consultar` está protegido con `express-rate-limit`. El límite por defecto es **20 peticiones por minuto por IP**. Si se supera, el servidor responde `429` con un mensaje ciudadano. Configurable con la variable `RATE_LIMIT_MAX`.

### CORS

La variable `CORS_ORIGIN` controla qué orígenes pueden consumir la API. Soporta múltiples valores separados por coma. Si está vacía, permite cualquier origen (modo dev).

| Entorno | `CORS_ORIGIN` |
|---|---|
| Docker Compose | `http://localhost:8080` |
| Producción | `https://dominio-real.gob.pe` |
| Desarrollo local (file://) | vacío |

## Accesibilidad

El portal cumple con las pautas **WCAG 2.1 nivel AA**:

- Todos los campos del formulario tienen `<label>` asociado y `aria-describedby` con texto de ayuda.
- Los errores de validación usan `aria-invalid="true"` y enfocan el campo afectado; el mensaje se anuncia mediante `aria-live="polite"`.
- El formulario declara `aria-busy="true"` durante la consulta; el botón muestra un spinner visual con `aria-hidden="true"` para no duplicar el anuncio al lector de pantalla.
- Los colores superan el ratio mínimo 4.5:1 contra fondo (primario #1a3c6e ≈ 10.9:1, muted #555555 ≈ 7.3:1, acento #007a5a ≈ 4.9:1, error #b3261e ≈ 6.2:1).
- El módulo de orientación usa `<details>/<summary>` nativo: navegable con teclado (Tab + Enter/Space) y compatible con lectores de pantalla sin JavaScript adicional.
- Navegación completa por teclado verificada: Tab, Shift+Tab, Enter, Space.

## Avance del turno de Franck

Se implementó el formulario ciudadano de consulta de expediente en el frontend, con validación de campos obligatorios, consumo del endpoint proxy `POST /api/expedientes/consultar`, estado de carga y mensajes de error orientados al ciudadano.

La respuesta exitosa muestra los datos principales del expediente y una línea de tiempo visual para los estados `DOCUMENTO REGISTRADO`, `EN PROCESO` y `SE EMITIO RESPUESTA`, con diseño mobile-first preparado para el ancho base de 375px.

## Avance del turno de Antuaneth

Se implementó el **módulo de orientación de trámites** como acordeón accesible (`<details>/<summary>`) con los cuatro tipos de procedimiento del Despacho Presidencial: Solicitud de Audiencia Presidencial, Petición Ciudadana, Recurso de Reconsideración y Denuncia Administrativa. Cada sección incluye descripción, requisitos y tiempo estimado de respuesta, más una sección de FAQs estáticas.

En accesibilidad: se agregó spinner visual en el botón durante la consulta, `aria-invalid` con foco automático en el campo erróneo, `aria-busy` en el formulario durante la carga, mensajes de error reescritos en lenguaje ciudadano y verificación de contraste WCAG AA en todos los colores del portal.

## Avance del turno de Cristina

**Pulido UX/UI:** se corrigió la jerarquía tipográfica en móvil (375px), donde el `h1` del header (1.25rem) quedaba más pequeño que los `h2` de sección (1.35rem); ahora el `h1` usa 1.4rem para mantener al título principal como el elemento de mayor jerarquía visual en ambos breakpoints. Se agregó `maxlength="4"` al campo de clave y una validación de formato (4 dígitos) en el cliente, alineada con el texto de ayuda del campo.

**Pruebas QA (4 escenarios) contra la API real del DP:**

| Escenario | Resultado |
|---|---|
| Expediente válido (`2026-0010582` / `4176`) | `200` — datos y línea de tiempo se renderizan correctamente |
| Clave incorrecta | API responde `401` → backend devuelve `404` "Expediente no encontrado o clave incorrecta" |
| Campo vacío | El formulario bloquea el envío antes de llamar a la API, con mensaje específico por campo |
| API caída / sin respuesta | `dpService` captura el error de red y devuelve `503` "El servicio del Despacho Presidencial no está disponible en este momento" |

También se verificaron los 4 expedientes de prueba (los tres estados `DOCUMENTO REGISTRADO`, `EN PROCESO` y `SE EMITIO RESPUESTA`, incluyendo la variante con tilde `SE EMITIÓ RESPUESTA`) y se confirmó que `normalizarEstado` los mapea correctamente en la línea de tiempo.

## Avance del turno de Cristina (continuación)

**Identidad visual institucional:** se reemplazó el color primario azul (`#1a3c6e`) por guinda (`#6e1423`) en botones, estados de foco, mensajes y acentos del portal, validando que el contraste con texto blanco siga cumpliendo WCAG AA (~11.7:1). Se cambió la tipografía base a una familia serif formal (`Georgia`, `Times New Roman`, `Cambria`) acorde a un portal del Estado.

**Limpieza de iconografía:** se quitaron los emojis usados como iconos en el acordeón de orientación de trámites (📋✉️⚖️🔔) y la regla CSS `.tramite-icono` asociada, que ya no se usaba.

**Mostrar/ocultar clave:** se agregó un botón con iconos SVG (ojo / ojo tachado) dentro del campo "Clave de acceso" que alterna entre `type="password"` y `type="text"`, con `aria-pressed` y `aria-label` dinámicos para mantener accesibilidad.

**Pendiente para Carlos:** validar que `docker compose up` siga construyendo correctamente el frontend (nginx) con estos cambios de HTML/CSS/JS antes del despliegue final.

## Avance del turno de Carlos

**Validación de despliegue final:** se ejecutó `docker compose up --build` en el repositorio y también en una carpeta clonada limpia (sin `node_modules` ni `.env`), siguiendo exactamente los pasos de la sección "Despliegue en 3 pasos". Backend (`:3000`) y frontend (`:8080`) levantan correctamente, incluyendo los cambios visuales (color guinda, tipografía serif, botón mostrar/ocultar clave) servidos por nginx.

Se verificaron los 4 escenarios de la API (expediente válido, clave incorrecta, campos vacíos, API caída), el proxy `nginx → backend`, CORS por origen y el rate limiting (20 req/min), todos funcionando como se documentó en el avance de Cristina.

**Limpieza de `docker-compose.yml`:** se eliminó el atributo `version: "3.9"`, marcado como obsoleto por Docker Compose v5 (generaba un warning en cada `docker compose up`/`ps`/`logs`).

**Instrucciones de despliegue:** se reescribió la sección de instalación como "Despliegue en 3 pasos" (clonar, configurar `.env`, `docker compose up`), aclarando que no se requiere instalar Node.js ni dependencias manualmente — la imagen del backend las instala durante el build. Se agregó una nota aparte para desarrollo local sin Docker (`npm install && npm run dev`).

**Constancia de consulta (diferenciador para el jurado):** tras una consulta exitosa, el portal muestra un botón **"Descargar constancia"** debajo de la línea de tiempo. Al hacer clic, se abre una pestaña nueva con un documento HTML imprimible con identidad institucional (Gobierno del Perú / Despacho Presidencial, color guinda, tipografía serif) que incluye:

- Número de expediente
- Tipo de trámite
- Estado actual
- Fecha y hora de consulta

La pestaña dispara automáticamente `window.print()`, permitiendo al ciudadano imprimir el documento o guardarlo como PDF desde el diálogo de impresión del navegador. El documento aclara que es informativo y no reemplaza notificaciones oficiales. Probado end-to-end con Playwright contra el stack levantado con Docker Compose: la consulta se renderiza correctamente y la constancia se genera con los datos esperados, sin errores de consola.
