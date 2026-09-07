// ==========================================
// CONFIGURACIÓN DE LOCALSTORAGE
// ==========================================

const STORAGE_KEY = "controlHorasPasantia";


// ==========================================
// CARGAR JORNADAS
// ==========================================

/**
 * Obtiene todas las jornadas guardadas.
 *
 * Si no hay datos, devuelve un arreglo vacío.
 */
function cargarJornadas() {

    const datos = localStorage.getItem(STORAGE_KEY);

    if (!datos) {
        return [];
    }

    try {

        const jornadas = JSON.parse(datos);

        if (!Array.isArray(jornadas)) {
            return [];
        }

        return jornadas;

    } catch (error) {

        console.error(
            "Error al cargar las jornadas:",
            error
        );

        return [];
    }
}


// ==========================================
// GUARDAR TODAS LAS JORNADAS
// ==========================================

/**
 * Guarda el arreglo completo de jornadas.
 */
function guardarJornadas(jornadas) {

    if (!Array.isArray(jornadas)) {
        return false;
    }

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(jornadas)
        );

        return true;

    } catch (error) {

        console.error(
            "Error al guardar las jornadas:",
            error
        );

        return false;
    }
}


// ==========================================
// AGREGAR JORNADA
// ==========================================

/**
 * Agrega una nueva jornada.
 *
 * Devuelve true si se guardó correctamente.
 */
function agregarJornada(jornada) {

    const jornadas = cargarJornadas();

    jornadas.push(jornada);

    return guardarJornadas(jornadas);
}


// ==========================================
// OBTENER JORNADA POR ID
// ==========================================

/**
 * Busca una jornada específica.
 */
function obtenerJornadaPorId(id) {

    const jornadas = cargarJornadas();

    return jornadas.find(
        jornada => jornada.id === id
    ) || null;
}


// ==========================================
// ACTUALIZAR JORNADA
// ==========================================

/**
 * Reemplaza los datos de una jornada
 * existente usando su ID.
 */
function actualizarJornada(jornadaActualizada) {

    const jornadas = cargarJornadas();

    const indice = jornadas.findIndex(
        jornada =>
            jornada.id === jornadaActualizada.id
    );

    if (indice === -1) {
        return false;
    }

    jornadas[indice] = jornadaActualizada;

    return guardarJornadas(jornadas);
}


// ==========================================
// ELIMINAR JORNADA
// ==========================================

/**
 * Elimina una jornada usando su ID.
 */
function eliminarJornada(id) {

    const jornadas = cargarJornadas();

    const nuevasJornadas =
        jornadas.filter(
            jornada => jornada.id !== id
        );

    if (
        nuevasJornadas.length === jornadas.length
    ) {
        return false;
    }

    return guardarJornadas(nuevasJornadas);
}


// ==========================================
// VERIFICAR JORNADA DUPLICADA
// ==========================================

/**
 * Comprueba si existe otra jornada
 * con exactamente la misma:
 *
 * fecha
 * entrada
 * salida
 *
 * El parámetro idIgnorar se utiliza
 * cuando estamos editando.
 */
function existeJornadaDuplicada(
    fecha,
    entrada,
    salida,
    idIgnorar = null
) {

    const jornadas = cargarJornadas();

    return jornadas.some(jornada => {

        if (
            idIgnorar &&
            jornada.id === idIgnorar
        ) {
            return false;
        }

        return (
            jornada.fecha === fecha &&
            jornada.entrada === entrada &&
            jornada.salida === salida
        );
    });
}


// ==========================================
// ORDENAR JORNADAS POR FECHA
// ==========================================

/**
 * Devuelve una copia del arreglo ordenada
 * desde la fecha más reciente a la más antigua.
 */
function ordenarJornadasPorFecha(jornadas) {

    if (!Array.isArray(jornadas)) {
        return [];
    }

    return [...jornadas].sort(
        (a, b) => {

            const fechaA =
                `${a.fecha}T${a.entrada}`;

            const fechaB =
                `${b.fecha}T${b.entrada}`;

            return fechaB.localeCompare(fechaA);
        }
    );
}


// ==========================================
// ELIMINAR TODOS LOS REGISTROS
// ==========================================

/**
 * Esta función no la usaremos todavía
 * en la interfaz, pero puede servir después
 * para restaurar o limpiar la aplicación.
 */
function eliminarTodasLasJornadas() {

    try {

        localStorage.removeItem(STORAGE_KEY);

        return true;

    } catch (error) {

        console.error(
            "Error al eliminar las jornadas:",
            error
        );

        return false;
    }
}