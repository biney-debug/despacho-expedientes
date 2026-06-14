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

## Instalación local

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/biney-debug/despacho-expedientes.git
cd despacho-expedientes

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y completar: API_DP_URL y PORT

# 3. Instalar dependencias del backend
cd backend && npm install && cd ..

# 4. Levantar con Docker Compose
docker compose up
# Backend: http://localhost:3000
# Frontend: http://localhost:8080
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
