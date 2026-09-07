let jornadaEditandoId = null;

const formJornada = document.getElementById("form-jornada");

const inputFecha = document.getElementById("fecha");
const inputEntrada = document.getElementById("entrada");
const inputSalida = document.getElementById("salida");
const inputDescanso = document.getElementById("descanso");
const inputObservacion = document.getElementById("observacion");

const checkboxDescanso = document.getElementById("descontar-descanso");
const campoDescanso = document.getElementById("campo-descanso");

const horasCompletadas = document.getElementById("horas-completadas");
const horasFaltantes = document.getElementById("horas-faltantes");
const porcentajeProgreso = document.getElementById("porcentaje-progreso");
const barraProgreso = document.getElementById("barra-progreso");

const tablaJornadas = document.getElementById("tabla-jornadas");
const tablaContainer = document.getElementById("tabla-container");
const sinRegistros = document.getElementById("sin-registros");
const cantidadJornadas = document.getElementById("cantidad-jornadas");

const vistaPrevia = document.getElementById("vista-previa");
const horasJornada = document.getElementById("horas-jornada");

const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");

const notificacion = document.getElementById("notificacion");

document.addEventListener("DOMContentLoaded", () => {
    establecerFechaActual();
    actualizarAplicacion();
});

checkboxDescanso.addEventListener("change", () => {
    campoDescanso.hidden = !checkboxDescanso.checked;

    if (!checkboxDescanso.checked) {
        inputDescanso.value = "01:00";
    }

    actualizarVistaPrevia();
});

inputEntrada.addEventListener("input", actualizarVistaPrevia);
inputSalida.addEventListener("input", actualizarVistaPrevia);
inputDescanso.addEventListener("input", actualizarVistaPrevia);

formJornada.addEventListener("submit", event => {
    event.preventDefault();

    const fecha = inputFecha.value;
    const entrada = inputEntrada.value;
    const salida = inputSalida.value;
    const observacion = inputObservacion.value.trim();

    let descansoMinutos = 0;

    if (checkboxDescanso.checked) {
        descansoMinutos = duracionAMinutos(inputDescanso.value);
    }

    const validacion = validarJornada(
        fecha,
        entrada,
        salida,
        descansoMinutos
    );

    if (!validacion.valida) {
        mostrarNotificacion(validacion.mensaje);
        return;
    }

    if (
        existeJornadaDuplicada(
            fecha,
            entrada,
            salida,
            jornadaEditandoId
        )
    ) {
        mostrarNotificacion(
            "Ya existe una jornada con esa fecha y horario."
        );
        return;
    }

    const minutosTrabajados = calcularMinutosTrabajados(
        entrada,
        salida,
        descansoMinutos
    );

    const jornada = {
        id: jornadaEditandoId || crypto.randomUUID(),
        fecha,
        entrada,
        salida,
        descanso: descansoMinutos,
        observacion,
        minutosTrabajados
    };

    let guardadoCorrectamente;

    if (jornadaEditandoId) {
        guardadoCorrectamente = actualizarJornada(jornada);
    } else {
        guardadoCorrectamente = agregarJornada(jornada);
    }

    if (!guardadoCorrectamente) {
        mostrarNotificacion(
            "No se pudo guardar la jornada."
        );
        return;
    }

    if (jornadaEditandoId) {
        mostrarNotificacion(
            "Jornada actualizada correctamente."
        );
    } else {
        mostrarNotificacion(
            "Jornada registrada correctamente."
        );
    }

    limpiarFormulario();
    actualizarAplicacion();
});

btnCancelar.addEventListener("click", () => {
    limpiarFormulario();
});

function actualizarAplicacion() {
    const jornadas = cargarJornadas();

    actualizarResumen(jornadas);
    renderizarJornadas(jornadas);
}

function actualizarResumen(jornadas) {
    const totalMinutos = calcularTotalJornadas(jornadas);

    const restantes = calcularRestantes(totalMinutos);

    const porcentaje = calcularPorcentaje(totalMinutos);

    horasCompletadas.textContent =
        formatearTiempo(totalMinutos);

    horasFaltantes.textContent =
        formatearTiempo(restantes);

    porcentajeProgreso.textContent =
        formatearPorcentaje(porcentaje);

    barraProgreso.style.width =
        `${porcentaje}%`;

    const contenedorBarra =
        barraProgreso.parentElement;

    contenedorBarra.setAttribute(
        "aria-valuenow",
        porcentaje
    );
}

function renderizarJornadas(jornadas) {
    tablaJornadas.innerHTML = "";

    const jornadasOrdenadas =
        ordenarJornadasPorFecha(jornadas);

    cantidadJornadas.textContent =
        `${jornadas.length} ${
            jornadas.length === 1
                ? "jornada"
                : "jornadas"
        }`;

    if (jornadasOrdenadas.length === 0) {
        sinRegistros.hidden = false;
        tablaContainer.hidden = true;
        return;
    }

    sinRegistros.hidden = true;
    tablaContainer.hidden = false;

    jornadasOrdenadas.forEach(jornada => {
        const fila = document.createElement("tr");

        const fecha = document.createElement("td");
        fecha.textContent = formatearFecha(
            jornada.fecha
        );

        const entrada = document.createElement("td");
        entrada.textContent = jornada.entrada;

        const salida = document.createElement("td");
        salida.textContent = jornada.salida;

        const descanso = document.createElement("td");
        descanso.textContent =
            jornada.descanso > 0
                ? formatearTiempo(jornada.descanso)
                : "Sin descanso";

        const total = document.createElement("td");
        total.textContent = formatearTiempo(
            jornada.minutosTrabajados
        );

        const acciones = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => {
            editarJornada(jornada.id);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {
            confirmarEliminarJornada(jornada.id);
        });

        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);

        fila.appendChild(fecha);
        fila.appendChild(entrada);
        fila.appendChild(salida);
        fila.appendChild(descanso);
        fila.appendChild(total);
        fila.appendChild(acciones);

        if (jornada.observacion) {
            fila.title = jornada.observacion;
        }

        tablaJornadas.appendChild(fila);
    });
}

function editarJornada(id) {
    const jornada = obtenerJornadaPorId(id);

    if (!jornada) {
        mostrarNotificacion(
            "No se encontró la jornada."
        );
        return;
    }

    jornadaEditandoId = jornada.id;

    inputFecha.value = jornada.fecha;
    inputEntrada.value = jornada.entrada;
    inputSalida.value = jornada.salida;
    inputObservacion.value =
        jornada.observacion || "";

    if (jornada.descanso > 0) {
        checkboxDescanso.checked = true;
        campoDescanso.hidden = false;

        inputDescanso.value =
            minutosADuracion(jornada.descanso);
    } else {
        checkboxDescanso.checked = false;
        campoDescanso.hidden = true;
        inputDescanso.value = "01:00";
    }

    btnGuardar.textContent = "Actualizar jornada";
    btnCancelar.hidden = false;

    actualizarVistaPrevia();

    window.scrollTo({
        top: formJornada.offsetTop - 40,
        behavior: "smooth"
    });
}

function confirmarEliminarJornada(id) {
    const jornada = obtenerJornadaPorId(id);

    if (!jornada) {
        mostrarNotificacion(
            "No se encontró la jornada."
        );
        return;
    }

    const confirmar = window.confirm(
        `¿Quieres eliminar la jornada del ${formatearFecha(jornada.fecha)}?`
    );

    if (!confirmar) {
        return;
    }

    const eliminada = eliminarJornada(id);

    if (!eliminada) {
        mostrarNotificacion(
            "No se pudo eliminar la jornada."
        );
        return;
    }

    if (jornadaEditandoId === id) {
        limpiarFormulario();
    }

    actualizarAplicacion();

    mostrarNotificacion(
        "Jornada eliminada correctamente."
    );
}

function actualizarVistaPrevia() {
    const entrada = inputEntrada.value;
    const salida = inputSalida.value;

    if (!entrada || !salida) {
        vistaPrevia.hidden = true;
        return;
    }

    let descanso = 0;

    if (checkboxDescanso.checked) {
        descanso = duracionAMinutos(
            inputDescanso.value
        );
    }

    const minutos = calcularMinutosTrabajados(
        entrada,
        salida,
        descanso
    );

    if (minutos <= 0) {
        vistaPrevia.hidden = true;
        return;
    }

    horasJornada.textContent =
        formatearTiempo(minutos);

    vistaPrevia.hidden = false;
}

function limpiarFormulario() {
    formJornada.reset();

    jornadaEditandoId = null;

    campoDescanso.hidden = true;
    vistaPrevia.hidden = true;
    btnCancelar.hidden = true;
    btnGuardar.textContent = "Guardar jornada";

    inputDescanso.value = "01:00";

    establecerFechaActual();
}

function establecerFechaActual() {
    if (inputFecha.value) {
        return;
    }

    const ahora = new Date();

    const anio = ahora.getFullYear();

    const mes = String(
        ahora.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        ahora.getDate()
    ).padStart(2, "0");

    inputFecha.value =
        `${anio}-${mes}-${dia}`;
}

function minutosADuracion(minutosTotales) {
    const minutos =
        Number(minutosTotales) || 0;

    const horas = Math.floor(
        minutos / 60
    );

    const minutosRestantes =
        minutos % 60;

    return `${String(horas).padStart(2, "0")}:${String(
        minutosRestantes
    ).padStart(2, "0")}`;
}

function mostrarNotificacion(mensaje) {
    notificacion.textContent = mensaje;
    notificacion.hidden = false;

    clearTimeout(
        mostrarNotificacion.timeout
    );

    mostrarNotificacion.timeout = setTimeout(
        () => {
            notificacion.hidden = true;
        },
        3000
    );
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .catch(error => {
                console.error(
                    "Error al registrar el Service Worker:",
                    error
                );
            });
    });
}