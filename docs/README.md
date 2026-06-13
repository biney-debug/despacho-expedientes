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

## Avance del turno de Franck

Se implementó el formulario ciudadano de consulta de expediente en el frontend, con validación de campos obligatorios, consumo del endpoint proxy `POST /api/expedientes/consultar`, estado de carga y mensajes de error orientados al ciudadano.

La respuesta exitosa muestra los datos principales del expediente y una línea de tiempo visual para los estados `DOCUMENTO REGISTRADO`, `EN PROCESO` y `SE EMITIO RESPUESTA`, con diseño mobile-first preparado para el ancho base de 375px.
