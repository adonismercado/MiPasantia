# ⏱️ Mi Pasantía

<p align="center">
  <strong>Control y seguimiento de horas de pasantía</strong>
</p>

<p align="center">
  Una aplicación web sencilla para registrar jornadas, calcular horas trabajadas y visualizar el progreso hacia la meta de la pasantía.
</p>

---

## 📌 Descripción

**Mi Pasantía** es una aplicación web creada para llevar un control personal de las horas realizadas durante una pasantía profesional.

La aplicación permite registrar cada jornada indicando la fecha, hora de entrada, hora de salida y, opcionalmente, el tiempo de descanso.

A partir de estos registros, el sistema calcula automáticamente:

- ⏱️ Horas trabajadas por jornada
- ✅ Horas acumuladas
- ⌛ Horas restantes
- 📊 Porcentaje de progreso
- 📈 Promedio de horas por jornada
- 📅 Fecha aproximada de finalización
- 🗂️ Historial completo de jornadas

La meta actualmente está configurada en **180 horas**.

---

## ✨ Funcionalidades

### 📝 Registro de jornadas

Cada jornada puede contener:

- Fecha
- Hora de entrada
- Hora de salida
- Tiempo de descanso opcional
- Observación

Antes de guardar el registro, la aplicación muestra automáticamente la cantidad de horas que serán contabilizadas.

### ⏰ Cálculo automático de horas

La duración de una jornada se obtiene utilizando:

```text
Horas trabajadas = Hora de salida - Hora de entrada - Descanso
```

Por ejemplo:

```text
Entrada:   08:00
Salida:    17:00
Descanso:  00:00

Total:     9 horas
```

Si se registra un descanso de una hora:

```text
Entrada:   08:00
Salida:    17:00
Descanso:  01:00

Total:     8 horas
```

---

## 📊 Dashboard

La página principal muestra un resumen del progreso de la pasantía.

### Horas completadas

Suma todas las jornadas registradas.

### Horas faltantes

Calcula cuánto falta para alcanzar la meta:

```text
180 horas - horas completadas
```

### Porcentaje

El porcentaje de progreso se obtiene mediante:

```text
(horas completadas / 180) × 100
```

También se representa visualmente mediante una barra de progreso.

### Promedio por jornada

La aplicación calcula el promedio de tiempo trabajado utilizando todas las jornadas registradas:

```text
Total de horas trabajadas / cantidad de jornadas
```

---

## 📅 Estimación de finalización

La aplicación puede calcular una **fecha aproximada para completar las 180 horas**.

Para hacerlo, analiza las jornadas registradas y determina los días de la semana en los que normalmente se trabaja.

Por ejemplo, si el historial contiene jornadas recurrentes los:

```text
Lunes
Miércoles
Jueves
Viernes
Sábado
```

la aplicación utiliza esos días para proyectar las futuras jornadas.

Además, calcula el promedio trabajado para cada día de la semana.

Ejemplo:

| Día | Promedio |
|---|---:|
| Lunes | 9 h |
| Miércoles | 4 h |
| Jueves | 9 h |
| Viernes | 4 h 30 min |
| Sábado | 5 h |

Con esos datos, el sistema avanza por las próximas fechas laborables y va sumando las horas estimadas hasta alcanzar las **180 horas**.

Por esta razón, la fecha mostrada es una **estimación dinámica** y puede cambiar a medida que se agregan, modifican o eliminan jornadas.

---

## 🗂️ Historial

Todas las jornadas registradas aparecen en una tabla con:

| Campo | Descripción |
|---|---|
| Fecha | Día trabajado |
| Entrada | Hora de entrada |
| Salida | Hora de salida |
| Descanso | Tiempo descontado |
| Total | Horas contabilizadas |
| Acciones | Editar o eliminar |

Los registros pueden modificarse posteriormente sin necesidad de eliminarlos y crearlos nuevamente.

Al modificar o eliminar una jornada, todos los cálculos del dashboard se actualizan automáticamente.

---

## 💾 Almacenamiento

Actualmente los datos se guardan utilizando:

```javascript
localStorage
```

Esto significa que **no se necesita una base de datos ni una cuenta de usuario**.

Los registros permanecen guardados en el navegador incluso después de cerrar la página.

> [!IMPORTANT]
> Los datos están asociados al navegador y dispositivo donde fueron registrados.
>
> Si se abre la página desde otro teléfono, computadora o navegador, los registros no aparecerán automáticamente.

Eliminar los datos del sitio o limpiar el almacenamiento del navegador también puede eliminar las jornadas guardadas.

---

## 📱 PWA

Mi Pasantía está preparada como una **Progressive Web App (PWA)**.

El proyecto incluye:

```text
manifest.json
service-worker.js
```

Esto permite ofrecer características propias de una aplicación instalada, además de almacenar recursos de la página en caché.

---

## 🛠️ Tecnologías

El proyecto está construido únicamente con tecnologías web nativas:

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white">
</p>

No utiliza frameworks ni dependencias de JavaScript.

---

## 📂 Estructura del proyecto

```text
MiPasantia/
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── calculations.js
│   ├── storage.js
│   └── app.js
│
├── assets/
│   ├── icons/
│   └── images/
│
├── manifest.json
├── service-worker.js
└── README.md
```

### `index.html`

Contiene la estructura principal de la interfaz.

### `styles.css`

Contiene todo el diseño visual y responsive de la aplicación.

### `calculations.js`

Contiene la lógica matemática:

- Cálculo de jornadas
- Conversión de horas a minutos
- Horas restantes
- Porcentaje
- Promedios
- Detección de días trabajados
- Estimación de fecha de finalización

### `storage.js`

Gestiona los datos almacenados mediante `localStorage`.

Se encarga de:

- Guardar jornadas
- Leer jornadas
- Editar jornadas
- Eliminar jornadas
- Detectar registros duplicados

### `app.js`

Conecta la interfaz con el resto de la aplicación.

Gestiona:

- Formulario
- Dashboard
- Historial
- Edición
- Eliminación
- Vista previa
- Notificaciones
- Actualización automática de estadísticas
- Registro del Service Worker

---

## 🚀 Uso

La aplicación está publicada mediante **GitHub Pages**.

### 🌐 Abrir Mi Pasantía

https://adonismercado.github.io/MiPasantia/

También puede ejecutarse localmente clonando el repositorio:

```bash
git clone https://github.com/adonismercado/MiPasantia.git
```

Luego:

```bash
cd MiPasantia
```

Y abrir `index.html` en un navegador.

---

## 🔄 Actualización de la aplicación

Después de realizar cambios:

```bash
git add .
git commit -m "Actualizar aplicación"
git push
```

GitHub Pages desplegará automáticamente la nueva versión desde la rama principal.


## 👨‍💻 Autor

**Adonis Mercado**

Proyecto personal desarrollado para facilitar el seguimiento de las horas de pasantía profesional.

---

<p align="center">
  <strong>180 horas. Una jornada a la vez. ⏱️</strong>
</p>
