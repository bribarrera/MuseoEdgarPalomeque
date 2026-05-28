# Sprint 6 — Generación de Reportes en PDF

---

## HU-021 — Generar reporte PDF del inventario completo

**Descripción:** Como administrador, quiero descargar un reporte PDF con todas las piezas activas del inventario para presentarlo en informes institucionales.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/reportes/index.tsx` (L.32–37) — Componente `ReportesPage` — estados de carga y error para cada reporte
- `frontend/src/pages/reportes/index.tsx` (L.7–16) — Función `descargar` — crea un enlace temporal con `URL.createObjectURL` y lo clickea para iniciar la descarga; `revokeObjectURL` con `setTimeout` de 500 ms para evitar cancelación prematura
- `frontend/src/pages/reportes/index.tsx` (L.39–50) — Función `handleInventario` — llama a `descargarReporteInventario()`, maneja loading y error con `leerErrorBlob`
- `frontend/src/pages/reportes/index.tsx` (L.72–82) — Tarjeta de descarga del inventario completo con estado de carga y mensaje de error
- `frontend/src/api/piezas.ts` (L.74–77) — Función `descargarReporteInventario` — GET /piezas/reporte/inventario con `responseType: 'blob'`

**Backend**
- `backend/src/controllers/piezas.controller.ts` (L.56–66) — `@Get('reporte/inventario')` — roles Administrador y Catalogador, devuelve `StreamableFile` con header `Content-Disposition: attachment`
- `backend/src/services/piezas.service.ts` (L.149–160) — Función `reporteInventario` — consulta todas las piezas activas con populate de categoría y ubicación, ordenadas por código
- `backend/src/controllers/utils/pdf.ts` (L.23–61) — Función `pdfInventario` — genera el PDF con encabezado institucional, tabla con 5 columnas (código, nombre, categoría, ubicación, conservación) y paginación automática

### Criterios de aceptación
1. ✅ Botón de descarga accesible solo para Administrador y Catalogador.
   → `backend/src/controllers/piezas.controller.ts` (L.57) — `@Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)`
2. ✅ El PDF incluye nombre del museo, título del reporte y fecha de generación.
   → `backend/src/controllers/utils/pdf.ts` (L.5–17) — función `encabezado`
3. ✅ El PDF lista todas las piezas activas con código, nombre, categoría, ubicación y estado de conservación.
   → `backend/src/controllers/utils/pdf.ts` (L.46–56)
4. ✅ El PDF pagina automáticamente cuando el contenido supera el límite de la página.
   → `backend/src/controllers/utils/pdf.ts` (L.47) — `if (y + RH > PB) { doc.addPage(); y = cabecera(40); }`
5. ✅ El archivo descargado tiene nombre con fecha incluida.
   → `backend/src/controllers/piezas.controller.ts` (L.63) — `filename="inventario_${fecha}.pdf"`
6. ✅ El botón muestra indicador de carga mientras se genera el PDF.
   → `frontend/src/pages/reportes/index.tsx` (L.79–81) — `{cargandoInv ? 'Generando...' : 'Descargar (.pdf)'}`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-042 | Instalar pdfkit y crear módulo utilitario de generación de PDFs | Backend |
| T-043 | Implementar endpoint de descarga de inventario completo | Backend |
| T-044 | Diseñar página de reportes con botón de descarga y estado de carga | Frontend |

---

## HU-022 — Generar reporte PDF por estado de conservación

**Descripción:** Como administrador, quiero descargar un reporte PDF filtrado por nivel de conservación para identificar las piezas que requieren intervención.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/reportes/index.tsx` (L.52–64) — Función `handleConservacion` — llama a `descargarReporteConservacion(nivel)`, el nombre del archivo incluye el nivel seleccionado
- `frontend/src/pages/reportes/index.tsx` (L.85–101) — Tarjeta con selector de nivel (Excelente / Bueno / Regular / Malo / todos) y botón de descarga
- `frontend/src/api/piezas.ts` (L.79–83) — Función `descargarReporteConservacion` — GET /piezas/reporte/conservacion con query param `nivel` opcional y `responseType: 'blob'`

**Backend**
- `backend/src/controllers/piezas.controller.ts` (L.68–82) — `@Get('reporte/conservacion')` — acepta `@Query('nivel')` opcional, roles Administrador y Catalogador
- `backend/src/services/piezas.service.ts` (L.162–176) — Función `reporteConservacion` — aplica filtro por `estadoConservacion` si se recibe `nivel`, ordena por nivel y código
- `backend/src/controllers/utils/pdf.ts` (L.63–112) — Función `pdfConservacion` — genera el PDF agrupando las piezas por nivel con encabezado de sección por grupo y filas alternas

### Criterios de aceptación
1. ✅ Selector de nivel de conservación con opción "Todos los niveles".
   → `frontend/src/pages/reportes/index.tsx` (L.92–95) — `<select>` con opción vacía y los 4 niveles
2. ✅ Si no se selecciona nivel, el reporte incluye todas las piezas agrupadas por nivel.
   → `backend/src/controllers/utils/pdf.ts` (L.70) — `const grupos = nivel ? [nivel] : ['Excelente', 'Bueno', 'Regular', 'Malo']`
3. ✅ Si se selecciona un nivel, el reporte incluye solo las piezas de ese nivel.
   → `backend/src/services/piezas.service.ts` (L.165) — `if (nivel) filtro.estadoConservacion = nivel`
4. ✅ El PDF muestra un encabezado de sección por cada nivel con el conteo de piezas.
   → `backend/src/controllers/utils/pdf.ts` (L.90–92) — fila resaltada con `NIVEL (N piezas)`
5. ✅ El archivo descargado incluye el nivel y la fecha en el nombre.
   → `frontend/src/pages/reportes/index.tsx` (L.57–58) — `conservacion${sufijo}_${fecha}.pdf`
6. ✅ El botón muestra indicador de carga mientras se genera el PDF.
   → `frontend/src/pages/reportes/index.tsx` (L.98–100) — `{cargandoCon ? 'Generando...' : 'Descargar (.pdf)'}`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-045 | Implementar generación de PDF agrupado por nivel de conservación | Backend |
| T-046 | Implementar endpoint con filtro opcional por nivel | Backend |
| T-047 | Añadir selector de nivel y botón de descarga en la página de reportes | Frontend |

---

## HU-023 — Consultar registro de auditoría del sistema

**Descripción:** Como administrador del museo, quiero consultar el historial de acciones del sistema para verificar quién realizó cambios y cuándo.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/auditoria/index.tsx` (L.32) — Componente `AuditoriaPage` — estados de filtros, datos y paginación
- `frontend/src/pages/auditoria/index.tsx` (L.41–51) — Función `cargar` — llama a `listAuditorias` pasando los filtros activos y actualiza `datos` y `totalPaginas`
- `frontend/src/pages/auditoria/index.tsx` (L.65–100) — Bloque de filtros — inputs de fecha desde/hasta, selector de módulo y selector de tipo de acción con botón para limpiar
- `frontend/src/pages/auditoria/index.tsx` (L.102–132) — Tabla de solo lectura con columnas: Fecha y hora, Usuario, Módulo y Acción
- `frontend/src/api/auditorias.ts` — Función `listAuditorias` — GET /auditorias con parámetros de filtro y paginación
- `frontend/src/pages/components/sidebar.tsx` — Ítem "Auditoría" visible únicamente para el rol Administrador

**Backend**
- `backend/src/controllers/auditorias.controller.ts` (L.9–10) — `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(RolEnum.ADMINISTRADOR)` — acceso restringido al Administrador
- `backend/src/controllers/auditorias.controller.ts` (L.16–26) — `@Get()` — acepta query params `pagina`, `limite`, `desde`, `hasta`, `entidad` y `accion`
- `backend/src/services/auditorias.service.ts` (L.15–72) — Función `listar` — construye el filtro dinámico, ejecuta aggregate con `$match`, `$sort`, `$skip`, `$limit`, `$lookup` hacia la colección usuarios y `$addFields` para resolver el nombre completo del usuario
- `backend/src/modules/auditorias.module.ts` — Módulo que registra el modelo `Auditoria` y conecta controlador y servicio

### Criterios de aceptación
1. ✅ Solo el Administrador puede acceder al registro de auditoría desde el menú principal.
   → `backend/src/controllers/auditorias.controller.ts` (L.9–10) — `@Roles(RolEnum.ADMINISTRADOR)`
   → `frontend/src/pages/components/sidebar.tsx` — `roles: [ROLES.ADMINISTRADOR]`
2. ✅ Cada entrada muestra fecha, nombre del usuario, módulo afectado y tipo de acción realizada.
   → `frontend/src/pages/auditoria/index.tsx` (L.106–111) — columnas de la tabla
   → `backend/src/services/auditorias.service.ts` (L.39–65) — `$lookup` y `$addFields` resuelven el nombre del usuario
3. ✅ Permite filtrar por rango de fechas, módulo y tipo de acción.
   → `frontend/src/pages/auditoria/index.tsx` (L.65–100) — filtros en pantalla
   → `backend/src/services/auditorias.service.ts` (L.18–28) — filtro dinámico `$match`
4. ✅ Los registros son de solo lectura y se ordenan del más reciente al más antiguo.
   → `backend/src/services/auditorias.service.ts` (L.35) — `{ $sort: { fechaEvento: -1 } }`
   → `frontend/src/pages/auditoria/index.tsx` (L.102–132) — tabla sin botones de edición ni eliminación

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-054 | Diseñar tabla de registro de auditoría con filtros por fecha, módulo y tipo de acción | Frontend |
| T-055 | Implementar endpoint de consulta de auditoría con paginación y resolución de nombre de usuario | Backend |
