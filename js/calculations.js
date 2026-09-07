// ==========================================
// CONFIGURACIÓN
// ==========================================

const META_HORAS = 180;
const META_MINUTOS = META_HORAS * 60;


// ==========================================
// CONVERTIR HORA A MINUTOS
// ==========================================

/**
 * Convierte una hora en formato HH:MM
 * a minutos desde las 00:00.
 *
 * Ejemplo:
 * "08:30" -> 510
 */
function horaAMinutos(hora) {

    if (!hora || !hora.includes(":")) {
        return 0;
    }

    const [horas, minutos] = hora.split(":").map(Number);

    return (horas * 60) + minutos;
}


// ==========================================
// CALCULAR DURACIÓN DE UNA JORNADA
// ==========================================

/**
 * Calcula los minutos transcurridos entre
 * la hora de entrada y la hora de salida.
 *
 * Ejemplo:
 * 08:00 - 17:00 = 540 minutos
 *
 * Retorna -1 si la salida es anterior
 * o igual a la entrada.
 */
function calcularMinutos(entrada, salida) {

    const minutosEntrada = horaAMinutos(entrada);
    const minutosSalida = horaAMinutos(salida);

    const diferencia = minutosSalida - minutosEntrada;

    if (diferencia <= 0) {
        return -1;
    }

    return diferencia;
}


// ==========================================
// CALCULAR JORNADA CON DESCANSO
// ==========================================

/**
 * Calcula los minutos reales trabajados
 * descontando el descanso.
 *
 * descansoMinutos debe ser un número.
 *
 * Ejemplo:
 *
 * 08:00 - 17:00 = 540 minutos
 * descanso = 60
 *
 * resultado = 480 minutos = 8 horas
 */
function calcularMinutosTrabajados(
    entrada,
    salida,
    descansoMinutos = 0
) {

    const minutosJornada = calcularMinutos(
        entrada,
        salida
    );

    if (minutosJornada <= 0) {
        return -1;
    }

    const descanso = Number(descansoMinutos) || 0;

    if (descanso < 0) {
        return -1;
    }

    if (descanso >= minutosJornada) {
        return -1;
    }

    return minutosJornada - descanso;
}


// ==========================================
// CONVERTIR DURACIÓN HH:MM A MINUTOS
// ==========================================

/**
 * Esta función sirve principalmente para
 * convertir el campo de descanso.
 *
 * Ejemplo:
 *
 * "01:00" -> 60
 * "00:30" -> 30
 * "01:15" -> 75
 */
function duracionAMinutos(duracion) {

    if (!duracion || !duracion.includes(":")) {
        return 0;
    }

    const [horas, minutos] = duracion
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


// ==========================================
// FORMATEAR MINUTOS
// ==========================================

/**
 * Convierte minutos a un formato fácil
 * de leer.
 *
 * Ejemplos:
 *
 * 60  -> "1 h"
 * 90  -> "1 h 30 min"
 * 270 -> "4 h 30 min"
 */
function formatearTiempo(totalMinutos) {

    let minutos = Number(totalMinutos) || 0;

    if (minutos < 0) {
        minutos = 0;
    }

    const horas = Math.floor(minutos / 60);

    const minutosRestantes = minutos % 60;


    if (horas === 0) {
        return `${minutosRestantes} min`;
    }


    if (minutosRestantes === 0) {
        return `${horas} h`;
    }


    return `${horas} h ${minutosRestantes} min`;
}


// ==========================================
// CALCULAR HORAS RESTANTES
// ==========================================

/**
 * Calcula cuántos minutos faltan
 * para alcanzar las 180 horas.
 */
function calcularRestantes(minutosCompletados) {

    const completados =
        Number(minutosCompletados) || 0;

    const restantes =
        META_MINUTOS - completados;

    return Math.max(restantes, 0);
}


// ==========================================
// CALCULAR PORCENTAJE
// ==========================================

/**
 * Calcula el porcentaje completado
 * respecto a las 180 horas.
 *
 * Devuelve un número con máximo
 * dos decimales.
 */
function calcularPorcentaje(minutosCompletados) {

    const completados =
        Number(minutosCompletados) || 0;

    if (META_MINUTOS === 0) {
        return 0;
    }

    const porcentaje =
        (completados / META_MINUTOS) * 100;

    const porcentajeLimitado =
        Math.min(Math.max(porcentaje, 0), 100);

    return Number(
        porcentajeLimitado.toFixed(2)
    );
}


// ==========================================
// CALCULAR TOTAL DE JORNADAS
// ==========================================

/**
 * Suma los minutos trabajados de
 * todas las jornadas.
 *
 * Espera objetos como:
 *
 * {
 *     minutosTrabajados: 480
 * }
 */
function calcularTotalJornadas(jornadas) {

    if (!Array.isArray(jornadas)) {
        return 0;
    }

    return jornadas.reduce(
        (total, jornada) => {

            const minutos =
                Number(jornada.minutosTrabajados) || 0;

            return total + minutos;

        },
        0
    );
}


// ==========================================
// FORMATEAR PORCENTAJE
// ==========================================

/**
 * Ejemplos:
 *
 * 10    -> "10%"
 * 14.72 -> "14.72%"
 */
function formatearPorcentaje(porcentaje) {

    const numero = Number(porcentaje) || 0;

    return `${numero}%`;
}


// ==========================================
// FORMATEAR FECHA
// ==========================================

/**
 * Convierte:
 *
 * "2026-09-07"
 *
 * en:
 *
 * "07/09/2026"
 *
 * Se hace manualmente para evitar
 * problemas de zona horaria con Date.
 */
function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
}


// ==========================================
// VALIDAR JORNADA
// ==========================================

/**
 * Realiza las validaciones principales
 * antes de guardar una jornada.
 *
 * Devuelve:
 *
 * {
 *     valida: true,
 *     mensaje: ""
 * }
 *
 * o:
 *
 * {
 *     valida: false,
 *     mensaje: "..."
 * }
 */
function validarJornada(
    fecha,
    entrada,
    salida,
    descansoMinutos = 0
) {

    if (!fecha) {

        return {
            valida: false,
            mensaje: "Debes seleccionar una fecha."
        };
    }


    if (!entrada) {

        return {
            valida: false,
            mensaje: "Debes indicar la hora de entrada."
        };
    }


    if (!salida) {

        return {
            valida: false,
            mensaje: "Debes indicar la hora de salida."
        };
    }


    const minutosJornada =
        calcularMinutos(entrada, salida);


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