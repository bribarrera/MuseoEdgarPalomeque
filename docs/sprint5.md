# Sprint 5 — Búsqueda Avanzada y Dashboard con Métricas

---

## HU-018 — Búsqueda avanzada de piezas por criterios combinados

**Descripción:** Como usuario del museo, quiero buscar piezas usando múltiples criterios simultáneamente para localizar rápidamente una pieza específica.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/busqueda/index.tsx` (L.24–57) — Componente `BusquedaAvanzadaPage` — estados para búsqueda, categoría, ubicación, resultados y loading
- `frontend/src/pages/piezas/busqueda/index.tsx` (L.38–47) — Función `buscar` — llama a `listPiezas` con hasta 3 filtros combinados y límite de 50 resultados
- `frontend/src/pages/piezas/busqueda/index.tsx` (L.66–103) — Formulario con campo de texto, select de categoría y select de ubicación
- `frontend/src/pages/piezas/busqueda/index.tsx` (L.115–150) — Tabla de resultados con código, nombre, categoría, ubicación, estado de conservación y botón "Ver detalle"
- `frontend/src/api/piezas.ts` (L.4–11) — Función `listPiezas` — GET /piezas con parámetros `busqueda`, `idCategoria`, `idUbicacion`

**Backend**
- `backend/src/services/piezas.service.ts` (L.110–127) — Función `listar` — filtro `$or` por nombre y código con `$regex`, filtros por `categoria` y `ubicacion` como `ObjectId`
- `backend/src/controllers/piezas.controller.ts` (L.26–37) — `@Get()` — acepta query params `busqueda`, `idCategoria`, `idUbicacion`

### Criterios de aceptación
1. ✅ Formulario con campos para código/nombre, categoría y ubicación.
   → `frontend/src/pages/piezas/busqueda/index.tsx` (L.66–103)
2. ✅ Los criterios se pueden combinar libremente; al menos uno debe estar activo para buscar.
   → `frontend/src/pages/piezas/busqueda/index.tsx` (L.61) — `const hayFiltros = busqueda || idCategoria || idUbicacion`
3. ✅ Los resultados muestran código, nombre, categoría, ubicación y estado de conservación.
   → `frontend/src/pages/piezas/busqueda/index.tsx` (L.120–148)
4. ✅ Se muestra el total de resultados encontrados.
   → `frontend/src/pages/piezas/busqueda/index.tsx` (L.108–112) — mensaje con count total
5. ✅ Botón "Limpiar filtros" que reinicia el formulario y oculta la tabla.
   → `frontend/src/pages/piezas/busqueda/index.tsx` (L.49–54) — función `limpiar`
6. ✅ Cada fila tiene enlace "Ver detalle" que navega al detalle de la pieza.
   → `frontend/src/pages/piezas/busqueda/index.tsx` (L.143–147) — `navigate('/piezas/${p.idPieza}')`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-036 | Diseñar página de búsqueda avanzada con formulario de filtros combinados | Frontend |
| T-037 | Adaptar endpoint de listado para recibir múltiples filtros simultáneos | Backend |

---

## HU-019 — Ver métricas generales del inventario en el dashboard

**Descripción:** Como administrador, quiero ver en el dashboard métricas clave del inventario para tener una visión rápida del estado del museo.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/dashboard/index.tsx` (L.83–85) — `useEffect` que llama a `getEstadisticas()` al montar el componente
- `frontend/src/pages/dashboard/estadisticas.tsx` (L.53–97) — 3 tarjetas: total de piezas activas, movimientos del mes, piezas en mal estado
- `frontend/src/pages/dashboard/estadisticas.tsx` (L.101–127) — Gráfico de barras por estado de conservación (Excelente, Bueno, Regular, Malo)
- `frontend/src/pages/dashboard/estadisticas.tsx` (L.129–151) — Gráfico de barras con las categorías con más piezas
- `frontend/src/api/piezas.ts` (L.79–82) — Función `getEstadisticas` — GET /piezas/estadisticas

**Backend**
- `backend/src/services/piezas.service.ts` (L.108–145) — Función `estadisticas` — 5 consultas en paralelo con `Promise.all`: conteo activas, movimientos del mes, agrupación por conservación, agrupación por categoría con `$lookup`
- `backend/src/controllers/piezas.controller.ts` (L.50–54) — `@Get('estadisticas')` — accesible para todos los roles autenticados

### Criterios de aceptación
1. ✅ Tarjeta con total de piezas activas en el inventario.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.55–65)
2. ✅ Tarjeta con número de movimientos registrados en el mes actual.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.67–78)
3. ✅ Tarjeta con número de piezas en estado Malo, resaltada en rojo si es mayor a 0.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.80–96)
4. ✅ Gráfico de distribución por estado de conservación con barras de color diferente por nivel.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.101–127)
5. ✅ Gráfico con las 6 categorías más representadas del inventario.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.129–151)

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-038 | Diseñar sección de métricas en el dashboard con tarjetas y gráficos de barras | Frontend |
| T-039 | Crear endpoint de estadísticas con agregaciones de Mongoose | Backend |

---

## HU-020 — Ver alertas de piezas que requieren atención

**Descripción:** Como administrador, quiero ver en el dashboard las piezas en estado Regular o Malo para priorizar su atención.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/dashboard/estadisticas.tsx` (L.155–195) — Tabla de alertas con código, nombre, estado de conservación, ubicación y botón "Ver" que navega al detalle
- `frontend/src/pages/dashboard/estadisticas.tsx` (L.153) — La sección solo se renderiza si `stats.alertas.length > 0`
- `frontend/src/pages/dashboard/estadisticas.tsx` (L.188–191) — Botón "Ver" que navega a `/piezas/:idPieza`

**Backend**
- `backend/src/services/piezas.service.ts` (L.120–127) — Consulta de alertas — `estadoConservacion: { $in: ['Regular', 'Malo'] }`, populate de ubicación, limitada a 10 resultados, ordenada por estado
- `backend/src/services/piezas.service.ts` (L.140–142) — Normalización de `_id` a `idPieza` para el frontend

### Criterios de aceptación
1. ✅ La tabla de alertas muestra solo piezas con estado Regular o Malo.
   → `backend/src/services/piezas.service.ts` (L.120) — `$in: ['Regular', 'Malo']`
2. ✅ Cada fila muestra código, nombre, estado de conservación y ubicación actual.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.173–191)
3. ✅ Al hacer clic en "Ver" se navega al detalle completo de la pieza.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.188–191) — `navigate('/piezas/${a.idPieza}')`
4. ✅ La sección no aparece si no hay piezas que requieran atención.
   → `frontend/src/pages/dashboard/estadisticas.tsx` (L.153) — `{stats.alertas.length > 0 && (...)}`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-040 | Diseñar tabla de alertas en el dashboard con navegación al detalle | Frontend |
| T-041 | Incluir consulta de alertas dentro del endpoint de estadísticas | Backend |
