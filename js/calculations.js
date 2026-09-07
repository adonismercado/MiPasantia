const META_HORAS = 180;
const META_MINUTOS = META_HORAS * 60;

function horaAMinutos(hora) {
    if (!hora || !hora.includes(":")) {
        return 0;
    }

    const [horas, minutos] =
        hora.split(":").map(Number);

    return (horas * 60) + minutos;
}

function calcularMinutos(
    entrada,
    salida
) {
    const minutosEntrada =
        horaAMinutos(entrada);

    const minutosSalida =
        horaAMinutos(salida);

    const diferencia =
        minutosSalida - minutosEntrada;

    if (diferencia <= 0) {
        return -1;
    }

    return diferencia;
}

function calcularMinutosTrabajados(
    entrada,
    salida,
    descansoMinutos = 0
) {
    const minutosJornada =
        calcularMinutos(
            entrada,
            salida
        );

    if (minutosJornada <= 0) {
        return -1;
    }

    const descanso =
        Number(descansoMinutos) || 0;

    if (descanso < 0) {
        return -1;
    }

    if (descanso >= minutosJornada) {
        return -1;
    }

    return minutosJornada - descanso;
}

function duracionAMinutos(duracion) {
    if (
        !duracion ||
        !duracion.includes(":")
    ) {
        return 0;
    }

    const [horas, minutos] =
        duracion
            .split(":")
            .map(Number);

    if (
        Number.isNaN(horas) ||
        Number.isNaN(minutos)
    ) {
        return 0;
    }

    return (horas * 60) + minutos;
}

function formatearTiempo(totalMinutos) {
    let minutos =
        Number(totalMinutos) || 0;

    if (minutos < 0) {
        minutos = 0;
    }

    const horas =
        Math.floor(
            minutos / 60
        );

    const minutosRestantes =
        minutos % 60;

    if (horas === 0) {
        return `${minutosRestantes} min`;
    }

    if (minutosRestantes === 0) {
        return `${horas} h`;
    }

    return `${horas} h ${minutosRestantes} min`;
}

function calcularRestantes(
    minutosCompletados
) {
    const completados =
        Number(minutosCompletados) || 0;

    const restantes =
        META_MINUTOS - completados;

    return Math.max(
        restantes,
        0
    );
}

function calcularPorcentaje(
    minutosCompletados
) {
    const completados =
        Number(minutosCompletados) || 0;

    if (META_MINUTOS === 0) {
        return 0;
    }

    const porcentaje =
        (completados / META_MINUTOS) * 100;

    const porcentajeLimitado =
        Math.min(
            Math.max(
                porcentaje,
                0
            ),
            100
        );

    return Number(
        porcentajeLimitado.toFixed(2)
    );
}

function calcularTotalJornadas(
    jornadas
) {
    if (!Array.isArray(jornadas)) {
        return 0;
    }

    return jornadas.reduce(
        (total, jornada) => {

            const minutos =
                Number(
                    jornada.minutosTrabajados
                ) || 0;

            return total + minutos;
        },
        0
    );
}

function formatearPorcentaje(
    porcentaje
) {
    const numero =
        Number(porcentaje) || 0;

    return `${numero}%`;
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "";
    }

    const partes =
        fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    const [anio, mes, dia] =
        partes;

    return `${dia}/${mes}/${anio}`;
}

function validarJornada(
    fecha,
    entrada,
    salida,
    descansoMinutos = 0
) {
    if (!fecha) {
        return {
            valida: false,
            mensaje:
                "Debes seleccionar una fecha."
        };
    }

    if (!entrada) {
        return {
            valida: false,
            mensaje:
                "Debes indicar la hora de entrada."
        };
    }

    if (!salida) {
        return {
            valida: false,
            mensaje:
                "Debes indicar la hora de salida."
        };
    }

    const minutosJornada =
        calcularMinutos(
            entrada,
            salida
        );

    if (minutosJornada <= 0) {
        return {
            valida: false,
            mensaje:
                "La hora de salida debe ser posterior a la hora de entrada."
        };
    }

    const descanso =
        Number(descansoMinutos) || 0;

    if (descanso < 0) {
        return {
            valida: false,
            mensaje:
                "El tiempo de descanso no puede ser negativo."
        };
    }

    if (descanso >= minutosJornada) {
        return {
            valida: false,
            mensaje:
                "El descanso no puede ser igual o mayor que la jornada."
        };
    }

    return {
        valida: true,
        mensaje: ""
    };
}

function crearFechaLocal(fechaTexto) {
    if (!fechaTexto) {
        return null;
    }

    const partes =
        fechaTexto
            .split("-")
            .map(Number);

    if (partes.length !== 3) {
        return null;
    }

    const [
        anio,
        mes,
        dia
    ] = partes;

    return new Date(
        anio,
        mes - 1,
        dia,
        12,
        0,
        0,
        0
    );
}

function convertirFechaATexto(
    fecha
) {
    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function calcularPromedioJornada(
    jornadas
) {
    if (
        !Array.isArray(jornadas) ||
        jornadas.length === 0
    ) {
        return 0;
    }

    const total =
        calcularTotalJornadas(
            jornadas
        );

    return Math.round(
        total / jornadas.length
    );
}

function calcularPromediosPorDiaSemana(
    jornadas
) {
    const dias = {};

    if (!Array.isArray(jornadas)) {
        return dias;
    }

    jornadas.forEach(
        jornada => {

            const fecha =
                crearFechaLocal(
                    jornada.fecha
                );

            if (!fecha) {
                return;
            }

            const diaSemana =
                fecha.getDay();

            const minutos =
                Number(
                    jornada.minutosTrabajados
                ) || 0;

            if (minutos <= 0) {
                return;
            }

            if (!dias[diaSemana]) {
                dias[diaSemana] = {
                    total: 0,
                    cantidad: 0,
                    promedio: 0
                };
            }

            dias[diaSemana].total +=
                minutos;

            dias[diaSemana].cantidad +=
                1;
        }
    );

    Object.keys(
        dias
    ).forEach(
        dia => {

            dias[dia].promedio =
                Math.round(
                    dias[dia].total /
                    dias[dia].cantidad
                );
        }
    );

    return dias;
}

function obtenerUltimaFecha(
    jornadas
) {
    if (
        !Array.isArray(jornadas) ||
        jornadas.length === 0
    ) {
        return null;
    }

    const fechas =
        jornadas
            .map(
                jornada =>
                    jornada.fecha
            )
            .filter(Boolean)
            .sort();

    return fechas[
        fechas.length - 1
    ] || null;
}

function obtenerDiasLaborablesDetectados(
    jornadas
) {
    const promedios =
        calcularPromediosPorDiaSemana(
            jornadas
        );

    return Object.keys(
        promedios
    )
        .map(Number)
        .sort(
            (a, b) => a - b
        );
}

function obtenerNombresDiasLaborables(
    jornadas
) {
    const nombres = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ];

    const dias =
        obtenerDiasLaborablesDetectados(
            jornadas
        );

    return dias.map(
        dia =>
            nombres[dia]
    );
}

function estimarFechaFinalizacion(
    jornadas
) {
    if (
        !Array.isArray(jornadas) ||
        jornadas.length === 0
    ) {
        return null;
    }

    const totalMinutos =
        calcularTotalJornadas(
            jornadas
        );

    let restantes =
        calcularRestantes(
            totalMinutos
        );

    if (restantes <= 0) {
        const ultimaFecha =
            obtenerUltimaFecha(
                jornadas
            );

        return {
            fecha:
                ultimaFecha,

            jornadasRestantes:
                0,

            diasLaborables:
                obtenerNombresDiasLaborables(
                    jornadas
                )
        };
    }

    const promedios =
        calcularPromediosPorDiaSemana(
            jornadas
        );

    const diasLaborables =
        Object.keys(
            promedios
        );

    if (
        diasLaborables.length === 0
    ) {
        return null;
    }

    const ultimaFechaTexto =
        obtenerUltimaFecha(
            jornadas
        );

    const ultimaFecha =
        crearFechaLocal(
            ultimaFechaTexto
        );

    const hoy =
        new Date();

    hoy.setHours(
        12,
        0,
        0,
        0
    );

    let fechaActual;

    if (
        ultimaFecha &&
        ultimaFecha > hoy
    ) {
        fechaActual =
            new Date(
                ultimaFecha
            );
    } else {
        fechaActual =
            new Date(
                hoy
            );
    }

    let jornadasRestantes =
        0;

    let seguridad =
        0;

    while (
        restantes > 0 &&
        seguridad < 3650
    ) {
        fechaActual.setDate(
            fechaActual.getDate() + 1
        );

        const diaSemana =
            fechaActual.getDay();

        const datosDia =
            promedios[diaSemana];

        if (datosDia) {
            restantes -=
                datosDia.promedio;

            jornadasRestantes++;
        }

        seguridad++;
    }

    if (restantes > 0) {
        return null;
    }

    return {
        fecha:
            convertirFechaATexto(
                fechaActual
            ),

        jornadasRestantes,

        diasLaborables:
            obtenerNombresDiasLaborables(
                jornadas
            )
    };
}