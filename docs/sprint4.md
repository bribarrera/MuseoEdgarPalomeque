# Sprint 4 — Trazabilidad y Movimientos

---

## HU-014 — Registrar movimiento de una pieza

**Descripción:** Como catalogador, quiero registrar un movimiento o traslado de una pieza para mantener trazabilidad de su ubicación.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/movimientos/crear/index.tsx` (L.20–102) — Componente `CrearMovimientoPage` — formulario con tipo de movimiento, ubicación destino, fecha, motivo y responsable
- `frontend/src/pages/piezas/movimientos/crear/index.tsx` (L.30–41) — Función `handleSubmit` — envía datos al backend y redirige al detalle tras guardar
- `frontend/src/pages/piezas/detalle/index.tsx` (L.104–108) — Botón "+ Registrar movimiento" accesible solo para Administrador y Catalogador
- `frontend/src/api/piezas.ts` — Función `createMovimiento` — POST /piezas/:id/movimientos

**Backend**
- `backend/src/models/movimiento.entity.ts` (L.1–35) — Schema Mongoose `Movimiento` — tipoMovimiento, ubicacionOrigen, ubicacionDestino, fechaSalida, motivo, responsable, registradoPor
- `backend/src/dto/crear-movimiento.dto.ts` (L.1–19) — Valida campos obligatorios con `@IsEnum`, `@IsMongoId`, `@IsDateString`, `@IsString`
- `backend/src/services/piezas.service.ts` (L.137–157) — Función `crearMovimiento` — registra movimiento, actualiza ubicación y audita CREATE
- `backend/src/controllers/piezas.controller.ts` (L.105–113) — `@Post(':id/movimientos')` — roles Administrador y Catalogador

### Criterios de aceptación
1. ✅ Botón "Registrar movimiento" visible solo para Administrador y Catalogador en el detalle de la pieza.
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.104–108)
2. ✅ Campos obligatorios: tipo de movimiento, ubicación destino, fecha de salida, motivo y responsable.
   → `backend/src/dto/crear-movimiento.dto.ts` — `@IsEnum`, `@IsMongoId`, `@IsDateString`, `@IsString` con `MinLength`
3. ✅ Al confirmar el movimiento, la ubicación actual de la pieza se actualiza automáticamente.
   → `backend/src/services/piezas.service.ts` (L.153) — `pieza.ubicacion = new Types.ObjectId(dto.idUbicacionDestino)`
4. ✅ El movimiento queda guardado en el historial de trazabilidad de la pieza.
   → `backend/src/models/movimiento.entity.ts` (L.9) — `idPieza: Types.ObjectId` referencia a Pieza
5. ✅ Se muestra mensaje de confirmación al guardar.
   → `frontend/src/pages/piezas/movimientos/crear/index.tsx` (L.49–56) — modal de éxito y `navigate` al detalle
6. ✅ Se registra auditoría `CREATE` con usuario, entidad `MOVIMIENTO` y fecha.
   → `backend/src/services/piezas.service.ts` (L.155) — `this.auditar(idUsuario, 'CREATE', String(movimiento._id))`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-029 | Diseñar modelo de datos para movimientos y trazabilidad | Backend |
| T-030 | Diseñar formulario de registro de movimientos con tipos | Frontend |
| T-031 | Crear endpoint para registrar movimientos y actualizar ubicación automáticamente | Backend |

---

## HU-015 — Ver trazabilidad completa de una pieza

**Descripción:** Como usuario del museo, quiero ver el historial completo de movimientos de una pieza para conocer su trazabilidad.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/movimientos/historial/index.tsx` (L.17–71) — Componente `HistorialMovimientosPage` — tabla con fecha, tipo, origen, destino, motivo, responsable y registrado por
- `frontend/src/pages/piezas/movimientos/historial/index.tsx` (L.56–68) — Filas de la tabla con todos los datos del movimiento
- `frontend/src/pages/piezas/detalle/index.tsx` (L.109–111) — Botón "Ver trazabilidad" visible para Administrador y Catalogador
- `frontend/src/api/piezas.ts` — Función `getHistorialMovimientos` — GET /piezas/:id/movimientos

**Backend**
- `backend/src/controllers/piezas.controller.ts` (L.115–118) — `@Get(':id/movimientos')` — accesible con JwtAuthGuard
- `backend/src/services/piezas.service.ts` (L.160–170) — Función `historialMovimientos` — populate de ubicaciones y registradoPor, ordenado `.sort({ fechaSalida: -1 })`

### Criterios de aceptación
1. ✅ Botón "Ver trazabilidad" accesible desde el detalle de la pieza para Administrador y Catalogador.
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.109–111)
2. ✅ La tabla muestra todos los movimientos ordenados cronológicamente, el más reciente primero.
   → `backend/src/services/piezas.service.ts` (L.167) — `.sort({ fechaSalida: -1 })`
3. ✅ Cada fila muestra fecha, tipo, ubicación origen, ubicación destino, motivo, responsable y registrado por.
   → `frontend/src/pages/piezas/movimientos/historial/index.tsx` (L.56–68)

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-032 | Diseñar vista de trazabilidad completa en línea de tiempo | Frontend |
| T-033 | Implementar endpoint de historial de movimientos por pieza | Backend |

---

## HU-016 — Consultar movimientos recientes del inventario

**Descripción:** Como catalogador, quiero ver los movimientos recientes de todas las piezas para supervisar la actividad del inventario.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/movimientos/index.tsx` (L.18–126) — Componente `MovimientosPage` — tabla con fecha, pieza, tipo, origen, destino y responsable
- `frontend/src/pages/movimientos/index.tsx` (L.44–58) — Filtro por rango de fechas con campos `desde` y `hasta`
- `frontend/src/pages/movimientos/index.tsx` (L.110–121) — Paginación de 20 registros por página
- `frontend/src/pages/components/sidebar.tsx` — Enlace "Movimientos" visible para Administrador y Catalogador
- `frontend/src/api/piezas.ts` — Función `getMovimientosRecientes` — GET /piezas/movimientos con parámetros de fecha y paginación

**Backend**
- `backend/src/controllers/piezas.controller.ts` (L.38–49) — `@Get('movimientos')` — definido antes de `/:id` para que NestJS no confunda la ruta
- `backend/src/services/piezas.service.ts` (L.172–191) — Función `listarMovimientos` — filtro por fechas, populate de pieza y ubicaciones, paginación

### Criterios de aceptación
1. ✅ Sección "Movimientos" accesible desde el menú lateral para Administrador y Catalogador.
   → `frontend/src/pages/components/sidebar.tsx` — `roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR]`
2. ✅ Tabla con fecha, pieza, tipo de movimiento, origen, destino y responsable.
   → `frontend/src/pages/movimientos/index.tsx` (L.68–101)
3. ✅ Filtro por rango de fechas funcional.
   → `frontend/src/pages/movimientos/index.tsx` (L.44–58)
4. ✅ Paginación de 20 registros por página.
   → `frontend/src/pages/movimientos/index.tsx` (L.110–121)

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-034 | Diseñar tabla de movimientos recientes globales con filtro por fechas | Frontend |
| T-035 | Crear endpoint de consulta de movimientos globales del inventario | Backend |

---

## HU-017 — Buscar pieza por ubicación actual

**Descripción:** Como consultor, quiero buscar todas las piezas que están en una ubicación específica para localizarlas físicamente.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/index.tsx` (L.21–22) — Estados `idUbicacion` y `setIdUbicacion` para el filtro del listado
- `frontend/src/pages/piezas/index.tsx` (L.31) — `cargar` pasa `idUbicacion` a `listPiezas`
- `frontend/src/api/piezas.ts` (L.4–11) — Función `listPiezas` recibe `idUbicacion` como parámetro opcional — GET /piezas?idUbicacion=

**Backend**
- `backend/src/services/piezas.service.ts` (L.51–56) — Filtro `idUbicacion` en la función `listar` — `filtro.ubicacion = new Types.ObjectId(idUbicacion)`
- `backend/src/controllers/piezas.controller.ts` (L.30) — `@Query('idUbicacion') idUbicacion` en el endpoint GET /piezas

### Criterios de aceptación
1. ✅ Filtro "Ubicación" disponible en el listado de piezas para todos los roles.
   → `frontend/src/pages/piezas/index.tsx` — selector `idUbicacion` en el bloque de filtros
2. ✅ Al seleccionar una ubicación, solo se muestran las piezas en ese lugar.
   → `backend/src/services/piezas.service.ts` (L.51–54) — `filtro.ubicacion = new Types.ObjectId(idUbicacion)`
3. ✅ Se indica el total de piezas encontradas.
   → `backend/src/controllers/utils/pagination.ts` — `buildPaginado` retorna `total` en la respuesta
4. ✅ Selector de ubicación disponible con todas las ubicaciones registradas.
   → `frontend/src/pages/piezas/index.tsx` — `listUbicaciones().then(setUbicaciones)` en el `useEffect` inicial

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-036 | Implementar filtro por ubicación actual en listado de piezas | Frontend / Backend |
| T-037 | Pruebas funcionales de trazabilidad y movimientos | Frontend / Backend |
