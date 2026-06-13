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
      mensaje: "El numero de expediente es obligatorio. Ejemplo: 2026-0010582.",
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

  return { esValido: true };
}

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
  const { protocol, hostname, port } = window.location;
  const host = hostname || "localhost";
  const origenBackendLocal = `http://${host}:3000`;

  if (protocol === "file:" || port === "8080") {
    return `${origenBackendLocal}/api/expedientes/consultar`;
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
    </article>
  `;

  seccionResultado.hidden = false;
  seccionResultado.scrollIntoView({ behavior: "smooth", block: "start" });
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
  if (dias === 1) {
    return "1 dia";
  }

  if (Number.isFinite(Number(dias))) {
    return `${dias} dias`;
  }

  return "No informado";
}

function escaparHtml(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
