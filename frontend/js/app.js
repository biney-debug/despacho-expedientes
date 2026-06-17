const ESTADOS_TRAMITE = [
  {
    id: "DOCUMENTO REGISTRADO",
    titulo: "Documento registrado",
    descripcion: "El expediente fue recibido por el Despacho Presidencial.",
  },
  {
    id: "EN PROCESO",
    titulo: "En proceso",
    descripcion: "El tramite esta siendo evaluado por el area correspondiente.",
  },
  {
    id: "SE EMITIO RESPUESTA",
    titulo: "Respuesta emitida",
    descripcion: "El Despacho Presidencial emitio una respuesta formal.",
  },
];

const formulario = document.querySelector("#formulario-consulta");
const usuarioInput = document.querySelector("#usuario");
const claveInput = document.querySelector("#clave");
const botonMostrarClave = document.querySelector("#boton-mostrar-clave");
const iconoMostrarClave = botonMostrarClave.querySelector(".icono-mostrar");
const iconoOcultarClave = botonMostrarClave.querySelector(".icono-ocultar");
const botonConsultar = document.querySelector("#boton-consultar");
const btnTexto = botonConsultar.querySelector(".btn-texto");
const btnSpinner = botonConsultar.querySelector(".btn-spinner");
const mensajeConsulta = document.querySelector("#mensaje-consulta");
const seccionResultado = document.querySelector("#seccion-resultado");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usuario = usuarioInput.value.trim();
  const clave = claveInput.value.trim();

  ocultarResultado();
  limpiarErroresCampos();

  const validacion = validarFormulario(usuario, clave);
  if (!validacion.esValido) {
    mostrarMensaje(validacion.mensaje, "error");
    marcarCampoInvalido(validacion.campo);
    return;
  }

  setCargando(true);
  mostrarMensaje("Consultando el estado del expediente...", "info");

  try {
    const respuesta = await fetch(obtenerEndpointConsulta(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, clave }),
    });

    const payload = await respuesta.json().catch(() => null);

    if (!respuesta.ok || !payload?.success) {
      const mensaje =
        payload?.error ||
        "No pudimos consultar el expediente. Verifica los datos e intenta nuevamente.";
      mostrarMensaje(mensaje, "error");
      return;
    }

    mostrarMensaje("Consulta realizada correctamente.", "success");
    renderResultado(payload.data);
  } catch (error) {
    mostrarMensaje(
      "El servicio no esta disponible en este momento. Intenta nuevamente mas tarde.",
      "error"
    );
  } finally {
    setCargando(false);
  }
});

function validarFormulario(usuario, clave) {
  if (!usuario && !clave) {
    return {
      esValido: false,
      campo: "usuario",
      mensaje: "Ingresa el numero de expediente y la clave de acceso para continuar.",
    };
  }

  if (!usuario) {
    return {
      esValido: false,
      campo: "usuario",
      mensaje: "El numero de expediente es obligatorio. Ejemplo: 2026-XXXXXXX.",
    };
  }

  if (!/^2026-\d{7}$/.test(usuario)) {
    return {
      esValido: false,
      campo: "usuario",
      mensaje: "El formato del expediente no es valido. Debe ser 2026-XXXXXXX (siete digitos).",
    };
  }

  if (!clave) {
    return {
      esValido: false,
      campo: "clave",
      mensaje: "La clave de acceso es obligatoria. La encontraras en el comprobante de tu tramite.",
    };
  }

  if (!/^\d{4}$/.test(clave)) {
    return {
      esValido: false,
      campo: "clave",
      mensaje: "La clave debe tener 4 digitos. La encontraras en el comprobante de tu tramite.",
    };
  }

  return { esValido: true };
}

botonMostrarClave.addEventListener("click", () => {
  const mostrar = claveInput.type === "password";

  claveInput.type = mostrar ? "text" : "password";
  botonMostrarClave.setAttribute("aria-pressed", String(mostrar));
  botonMostrarClave.setAttribute("aria-label", mostrar ? "Ocultar clave" : "Mostrar clave");
  iconoMostrarClave.hidden = mostrar;
  iconoOcultarClave.hidden = !mostrar;
});

function marcarCampoInvalido(idCampo) {
  if (!idCampo) return;
  const campo = document.querySelector(`#${idCampo}`);
  if (!campo) return;
  campo.setAttribute("aria-invalid", "true");
  campo.focus();
}

function limpiarErroresCampos() {
  [usuarioInput, claveInput].forEach((campo) => campo.removeAttribute("aria-invalid"));
}

function obtenerEndpointConsulta() {
  if (window.location.protocol === "file:") {
    return "http://localhost:3000/api/expedientes/consultar";
  }

  return "/api/expedientes/consultar";
}

function setCargando(estaCargando) {
  botonConsultar.disabled = estaCargando;
  btnTexto.textContent = estaCargando ? "Consultando..." : "Consultar estado";
  btnSpinner.hidden = !estaCargando;
  formulario.setAttribute("aria-busy", String(estaCargando));
}

function mostrarMensaje(texto, tipo) {
  mensajeConsulta.hidden = false;
  mensajeConsulta.textContent = texto;
  mensajeConsulta.className = `message message-${tipo}`;
}

function ocultarResultado() {
  seccionResultado.hidden = true;
  seccionResultado.innerHTML = "";
}

function renderResultado(data) {
  const estadoActual = normalizarEstado(data.estado_actual);
  const indiceActual = ESTADOS_TRAMITE.findIndex((estado) => estado.id === estadoActual);

  seccionResultado.innerHTML = `
    <article class="card resultado-card">
      <div class="resultado-header">
        <div>
          <p class="eyebrow">Resultado de consulta</p>
          <h2>${escaparHtml(data.tramite || "Tramite registrado")}</h2>
        </div>
        <span class="status-pill">${escaparHtml(formatearEstado(estadoActual))}</span>
      </div>

      <dl class="detalle-grid">
        <div>
          <dt>Expediente</dt>
          <dd>${escaparHtml(data.numero_expediente || usuarioInput.value.trim())}</dd>
        </div>
        <div>
          <dt>Administrado</dt>
          <dd>${escaparHtml(data.administrado || "No informado")}</dd>
        </div>
        <div>
          <dt>Tiempo estimado</dt>
          <dd>${formatearDias(data.tiempo_estimado_resolucion_dias)}</dd>
        </div>
        <div>
          <dt>Ultima actualizacion</dt>
          <dd>${escaparHtml(data.ultima_actualizacion || "No informada")}</dd>
        </div>
      </dl>

      <div class="detalle-estado">
        <h3>Detalle del estado</h3>
        <p>${escaparHtml(data.detalle_estado || "El expediente cuenta con un estado registrado.")}</p>
      </div>

      <div class="timeline" aria-label="Linea de tiempo del tramite">
        ${ESTADOS_TRAMITE.map((estado, index) =>
          renderEstadoTimeline(estado, index, indiceActual)
        ).join("")}
      </div>

      <div class="resultado-acciones">
        <button id="boton-constancia" class="secondary-button" type="button">
          Descargar constancia
        </button>
      </div>
    </article>
  `;

  seccionResultado.hidden = false;
  seccionResultado.scrollIntoView({ behavior: "smooth", block: "start" });

  const botonConstancia = seccionResultado.querySelector("#boton-constancia");
  botonConstancia.addEventListener("click", () => {
    generarConstancia({
      numeroExpediente: data.numero_expediente || usuarioInput.value.trim(),
      tramite: data.tramite || "Tramite registrado",
      estado: formatearEstado(estadoActual),
      fechaConsulta: new Date(),
    });
  });
}

function generarConstancia({ numeroExpediente, tramite, estado, fechaConsulta }) {
  const fechaTexto = fechaConsulta.toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const ventana = window.open("", "_blank");

  if (!ventana) {
    mostrarMensaje(
      "No se pudo abrir la constancia. Habilita las ventanas emergentes para este sitio e intenta nuevamente.",
      "error"
    );
    return;
  }

  ventana.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Constancia de consulta - Expediente ${escaparHtml(numeroExpediente)}</title>
        <style>
          :root {
            --color-primary: #6e1423;
            --color-text: #1a1a1a;
            --color-text-muted: #555555;
            --color-border: #d0d7e3;
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: Georgia, "Times New Roman", Cambria, serif;
            color: var(--color-text);
            padding: 40px;
          }

          .constancia {
            border: 2px solid var(--color-primary);
            border-radius: 8px;
            padding: 32px;
            max-width: 640px;
            margin: 0 auto;
          }

          .constancia-header {
            border-bottom: 3px solid var(--color-primary);
            padding-bottom: 16px;
            margin-bottom: 24px;
            text-align: center;
          }

          .constancia-header p {
            color: var(--color-text-muted);
            font-size: 0.8rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .constancia-header h1 {
            color: var(--color-primary);
            font-size: 1.3rem;
            margin-top: 4px;
          }

          .constancia-titulo {
            font-size: 1.05rem;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 24px;
          }

          dl {
            display: grid;
            gap: 16px;
            margin-bottom: 28px;
          }

          .constancia dt {
            color: var(--color-text-muted);
            font-size: 0.78rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .constancia dd {
            font-size: 1.05rem;
            font-weight: 700;
            margin-top: 2px;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 6px;
          }

          .constancia-footer {
            border-top: 1px solid var(--color-border);
            padding-top: 16px;
            color: var(--color-text-muted);
            font-size: 0.8rem;
            line-height: 1.5;
          }

          @media print {
            body { padding: 0; }
            .constancia { border: none; }
          }
        </style>
      </head>
      <body>
        <main class="constancia">
          <header class="constancia-header">
            <p>Gobierno del Peru</p>
            <h1>Despacho Presidencial</h1>
          </header>

          <p class="constancia-titulo">Constancia de consulta de expediente</p>

          <dl>
            <div>
              <dt>Numero de expediente</dt>
              <dd>${escaparHtml(numeroExpediente)}</dd>
            </div>
            <div>
              <dt>Tipo de tramite</dt>
              <dd>${escaparHtml(tramite)}</dd>
            </div>
            <div>
              <dt>Estado actual</dt>
              <dd>${escaparHtml(estado)}</dd>
            </div>
            <div>
              <dt>Fecha y hora de consulta</dt>
              <dd>${escaparHtml(fechaTexto)}</dd>
            </div>
          </dl>

          <p class="constancia-footer">
            Este documento es una constancia informativa generada por el portal ciudadano de
            consulta de expedientes del Despacho Presidencial. No constituye un documento oficial
            ni reemplaza las notificaciones formales del tramite.
          </p>
        </main>
        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
}

function renderEstadoTimeline(estado, index, indiceActual) {
  const estadoClase =
    index < indiceActual ? "is-complete" : index === indiceActual ? "is-current" : "is-pending";
  const marcador = index < indiceActual ? "OK" : String(index + 1);

  return `
    <div class="timeline-item ${estadoClase}">
      <div class="timeline-marker" aria-hidden="true">${marcador}</div>
      <div class="timeline-content">
        <h3>${estado.titulo}</h3>
        <p>${estado.descripcion}</p>
      </div>
    </div>
  `;
}

function normalizarEstado(estado) {
  return String(estado || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatearEstado(estado) {
  const encontrado = ESTADOS_TRAMITE.find((item) => item.id === estado);
  return encontrado ? encontrado.titulo : "Estado no informado";
}

function formatearDias(dias) {
  const n = Number(dias);

  if (!Number.isFinite(n)) return "No informado";
  if (n === 0) return "Resuelto";
  if (n === 1) return "1 dia habil";
  return `${n} dias habiles`;
}

function escaparHtml(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
