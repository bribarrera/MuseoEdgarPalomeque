# Sprint 2 — Gestión del Inventario de Piezas Etnográficas

---

## HU-006 — Registrar nueva pieza en el inventario

**Descripción:** Como catalogador o administrador, quiero registrar una nueva pieza etnográfica con todos sus datos y una fotografía para mantener el inventario actualizado. Para ello, el Administrador debe poder gestionar previamente las categorías y ubicaciones disponibles.

### ¿Dónde está en el código?

**Frontend — Piezas**
- `frontend/src/pages/piezas/crear/index.tsx` (L.11–104) — Componente `CrearPiezaPage` — formulario completo de nueva pieza con todos los campos requeridos
- `frontend/src/pages/piezas/crear/index.tsx` (L.26–39) — Función `handleSubmit` — envía datos e imagen al backend y activa el modal
- `frontend/src/pages/piezas/crear/index.tsx` (L.46–57) — Modal de confirmación — muestra el código de inventario asignado antes de redirigir
- `frontend/src/api/piezas.ts` (L.18–21) — Función `createPieza` — POST /piezas con multipart/form-data

**Frontend — Categorías**
- `frontend/src/pages/categorias/index.tsx` (L.6–45) — Componente `CategoriasPage` — tabla con botones crear/editar (solo Administrador)
- `frontend/src/pages/categorias/crear/index.tsx` (L.9–44) — Componente `CrearCategoriaPage` — formulario de nueva categoría
- `frontend/src/pages/categorias/editar/index.tsx` (L.8–62) — Componente `EditarCategoriaPage` — formulario de edición de categoría
- `frontend/src/api/categorias.ts` (L.4–7) — Función `listCategorias` — GET /categorias
- `frontend/src/api/categorias.ts` (L.9–12) — Función `createCategoria` — POST /categorias
- `frontend/src/api/categorias.ts` (L.14–17) — Función `updateCategoria` — PATCH /categorias/:id

**Frontend — Ubicaciones**
- `frontend/src/pages/ubicaciones/index.tsx` (L.6–45) — Componente `UbicacionesPage` — tabla con botones crear/editar (solo Administrador)
- `frontend/src/pages/ubicaciones/crear/index.tsx` (L.9–44) — Componente `CrearUbicacionPage` — formulario de nueva ubicación
- `frontend/src/pages/ubicaciones/editar/index.tsx` (L.8–62) — Componente `EditarUbicacionPage` — formulario de edición de ubicación
- `frontend/src/api/ubicaciones.ts` (L.4–6) — Función `listUbicaciones` — GET /ubicaciones
- `frontend/src/api/ubicaciones.ts` (L.9–11) — Función `createUbicacion` — POST /ubicaciones
- `frontend/src/api/ubicaciones.ts` (L.14–16) — Función `updateUbicacion` — PATCH /ubicaciones/:id

**Backend — Piezas**
- `backend/src/models/pieza.entity.ts` (L.18–56) — Schema Mongoose `Pieza` — codigoInventario, nombre, descripcion, origen, dimensiones, estadoConservacion, imagen (URL Cloudinary)
- `backend/src/dto/crear-pieza.dto.ts` (L.1–31) — Valida campos obligatorios: codigoInventario, nombre, descripcion, origen, dimensiones, idCategoria, idUbicacion
- `backend/src/services/piezas.service.ts` (L.21–40) — Función `crear` — valida código único, sube imagen a Cloudinary y registra auditoría
- `backend/src/controllers/piezas.controller.ts` (L.41–50) — `@Post()` — recibe datos + imagen con Multer (memoryStorage → Cloudinary)
- `backend/src/config/cloudinary.ts` (L.12–22) — Función `subirImagenCloudinary` — sube el buffer a Cloudinary y retorna la URL segura

**Backend — Categorías**
- `backend/src/models/categoria.entity.ts` (L.1–26) — Schema Mongoose `Categoria` — campos nombre y descripcion
- `backend/src/dto/crear-categoria.dto.ts` (L.1–10) — Valida que el nombre no esté vacío
- `backend/src/services/categorias.service.ts` (L.17–19) — Función `listar` — retorna categorías ordenadas por nombre
- `backend/src/services/categorias.service.ts` (L.21–28) — Función `crear` — valida nombre único y registra auditoría CREATE
- `backend/src/services/categorias.service.ts` (L.30–43) — Función `actualizar` — aplica cambios y registra auditoría UPDATE
- `backend/src/controllers/categorias.controller.ts` (L.11–35) — `@Controller('categorias')` — endpoints GET, POST y PATCH de categorías

**Backend — Ubicaciones**
- `backend/src/models/ubicacion.entity.ts` (L.1–26) — Schema Mongoose `Ubicacion` — campos nombre y descripcion
- `backend/src/dto/crear-ubicacion.dto.ts` (L.1–10) — Valida que el nombre no esté vacío
- `backend/src/services/ubicaciones.service.ts` (L.17–19) — Función `listar` — retorna ubicaciones ordenadas por nombre
- `backend/src/services/ubicaciones.service.ts` (L.21–28) — Función `crear` — valida nombre único y registra auditoría CREATE
- `backend/src/services/ubicaciones.service.ts` (L.30–43) — Función `actualizar` — aplica cambios y registra auditoría UPDATE
- `backend/src/controllers/ubicaciones.controller.ts` (L.11–35) — `@Controller('ubicaciones')` — endpoints GET, POST y PATCH de ubicaciones
- `backend/src/modules/piezas.module.ts` (L.1–29) — Agrupa Pieza, Categoría y Ubicación en un solo módulo NestJS

### Criterios de aceptación

**Registro de pieza**
1. ✅ Botón "Registrar pieza" disponible solo para Administrador y Catalogador.
   → `backend/src/controllers/piezas.controller.ts` (L.42) — `@Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)`
2. ✅ Campos obligatorios: código de inventario (único), nombre, descripción, origen, dimensiones, categoría y ubicación.
   → `backend/src/dto/crear-pieza.dto.ts` (L.1–31) — decoradores `@IsNotEmpty` en todos los campos requeridos
3. ✅ Campos opcionales: año aproximado, estado de conservación (default: Bueno), fotografía.
   → `backend/src/services/piezas.service.ts` (L.33) — `estadoConservacion: dto.estadoConservacion ?? 'Bueno'`
4. ✅ El código de inventario no puede duplicarse; el sistema rechaza el registro si ya existe.
   → `backend/src/services/piezas.service.ts` (L.22–24) — `findOne({ codigoInventario })` lanza `ConflictException`
5. ✅ Al guardar, se muestra modal con el código de inventario asignado antes de redirigir.
   → `frontend/src/pages/piezas/crear/index.tsx` (L.34) — `setCodigoGuardado(resultado.codigoInventario)`
   → `frontend/src/pages/piezas/crear/index.tsx` (L.46–57) — modal con el código en azul y botón "Ir al inventario"
6. ✅ La imagen se sube a Cloudinary y la URL completa se almacena en la base de datos.
   → `backend/src/config/cloudinary.ts` (L.12–22) — `subirImagenCloudinary(file.buffer)` retorna `secure_url`
   → `backend/src/services/piezas.service.ts` (L.25) — `imagen: imagenUrl` guardado en el documento
7. ✅ Se registra auditoría `CREATE` con usuario, entidad `PIEZA` y fecha.
   → `backend/src/services/piezas.service.ts` (L.38–39) — `auditar(idAccion, 'CREATE', pieza._id)`

**Gestión de Categorías**
8. ✅ Solo el Administrador puede crear o editar categorías.
   → `backend/src/controllers/categorias.controller.ts` (L.23) — `@Roles(RolEnum.ADMINISTRADOR)` en POST y PATCH
9. ✅ Campo obligatorio: nombre (único en el sistema). Descripción es opcional.
   → `backend/src/dto/crear-categoria.dto.ts` (L.1–10) — `@IsNotEmpty` en nombre, `@IsOptional` en descripcion
10. ✅ El sistema rechaza si se intenta crear una categoría con nombre duplicado.
    → `backend/src/services/categorias.service.ts` (L.22–24) — `findOne({ nombre })` lanza `ConflictException`
11. ✅ Las categorías creadas aparecen en el selector del formulario de registro de pieza.
    → `frontend/src/pages/piezas/crear/index.tsx` (L.16–23) — `useEffect` llama a `listCategorias()` y carga el `<select>`
12. ✅ Se registra auditoría `CREATE` / `UPDATE` por cada acción sobre una categoría.
    → `backend/src/services/categorias.service.ts` (L.46) — `auditar(idAccion, accion, id)`

**Gestión de Ubicaciones**
13. ✅ Solo el Administrador puede crear o editar ubicaciones.
    → `backend/src/controllers/ubicaciones.controller.ts` (L.23) — `@Roles(RolEnum.ADMINISTRADOR)` en POST y PATCH
14. ✅ Campo obligatorio: nombre (único en el sistema). Descripción es opcional.
    → `backend/src/dto/crear-ubicacion.dto.ts` (L.1–10) — `@IsNotEmpty` en nombre, `@IsOptional` en descripcion
15. ✅ El sistema rechaza si se intenta crear una ubicación con nombre duplicado.
    → `backend/src/services/ubicaciones.service.ts` (L.22–24) — `findOne({ nombre })` lanza `ConflictException`
16. ✅ Las ubicaciones creadas aparecen en el selector del formulario de registro de pieza.
    → `frontend/src/pages/piezas/crear/index.tsx` (L.16–23) — `useEffect` llama a `listUbicaciones()` y carga el `<select>`
17. ✅ Se registra auditoría `CREATE` / `UPDATE` por cada acción sobre una ubicación.
    → `backend/src/services/ubicaciones.service.ts` (L.46) — `auditar(idAccion, accion, id)`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-010 | Definir entidades Pieza, Categoría y Ubicación (Mongoose schemas) | Backend |
| T-011 | Implementar endpoints CRUD de Categorías y Ubicaciones (solo Administrador) con validación de nombre único | Backend |
| T-012 | Diseñar páginas de gestión de Categorías y Ubicaciones con tabla, crear y editar | Frontend |
| T-013 | Implementar endpoint POST /piezas con validación de código único y auditoría | Backend |
| T-014 | Integrar Cloudinary para almacenamiento de imágenes (memoryStorage + upload_stream) | Backend |
| T-015 | Diseñar formulario de registro con selectores de categoría/ubicación y modal de confirmación | Frontend |

---

## HU-007 — Consultar inventario de piezas

**Descripción:** Como usuario del museo (cualquier rol), quiero ver el listado del inventario con opciones de búsqueda y filtros para localizar piezas rápidamente.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/index.tsx` (L.14–148) — Componente `PiezasPage` — tabla de inventario con búsqueda, filtros y paginación de 20
- `frontend/src/pages/piezas/index.tsx` (L.31–35) — Función `cargar` — llama a `listPiezas` con busqueda, idCategoria, idUbicacion y estado
- `frontend/src/api/piezas.ts` (L.4–11) — Función `listPiezas` — GET /piezas con todos los parámetros de filtro y paginación
- `frontend/src/api/ubicaciones.ts` (L.4–6) — Función `listUbicaciones` — carga el selector de filtro por ubicación en el listado

**Backend**
- `backend/src/services/piezas.service.ts` (L.43–60) — Función `listar` — aplica filtros opcionales (busqueda, idCategoria, idUbicacion, estado) con paginación de 20
- `backend/src/controllers/piezas.controller.ts` (L.22–32) — `@Get()` — acepta query params: busqueda, idCategoria, idUbicacion, estado, pagina, limite

### Criterios de aceptación
1. ✅ Tabla con columnas: código, nombre, categoría, ubicación, estado y fecha de ingreso.
   → `frontend/src/pages/piezas/index.tsx` (L.80–90) — encabezados `<th>` de la tabla
2. ✅ Los tres roles (Administrador, Catalogador, Consultor) pueden consultar el inventario.
   → `backend/src/controllers/piezas.controller.ts` (L.22) — `@Get()` sin `@Roles`, solo requiere `JwtAuthGuard`
3. ✅ Búsqueda por nombre o código de inventario (regex insensible a mayúsculas).
   → `backend/src/services/piezas.service.ts` (L.46–49) — `$or` con `$regex` e `$options: 'i'`
4. ✅ Filtro por categoría, por ubicación y por estado.
   → `backend/src/services/piezas.service.ts` (L.50–53) — `filtro.categoria`, `filtro.ubicacion`, `filtro.estado`
   → `frontend/src/pages/piezas/index.tsx` (L.57–70) — selectores desplegables de categoría, ubicación y estado
5. ✅ Paginación de 20 piezas por página con botones numéricos.
   → `frontend/src/pages/piezas/index.tsx` (L.10) — `const LIMITE_PIEZAS = 20`
   → `frontend/src/pages/piezas/index.tsx` (L.120–135) — botones de paginación numérica
6. ✅ Botón "Ver" en cada fila para acceder al detalle completo (HU-008).
   → `frontend/src/pages/piezas/index.tsx` (L.100) — `navigate('/piezas/${p.idPieza}')`
7. ✅ Las piezas con estado "Baja" no aparecen por defecto.
   → `backend/src/services/piezas.service.ts` (L.53) — `filtro.estado = { $ne: 'Baja' }` cuando no hay filtro de estado

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-016 | Implementar endpoint GET /piezas con filtros por búsqueda, categoría, ubicación, estado y paginación | Backend |
| T-017 | Diseñar tabla de inventario con barra de búsqueda, filtros desplegables (incluye ubicación) y botón Ver | Frontend |

---

## HU-008 — Ver detalle de una pieza

**Descripción:** Como usuario del museo, quiero ver todos los datos de una pieza específica, incluyendo su fotografía, ubicación y estado de conservación, para conocer el registro completo.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/detalle/index.tsx` (L.17–96) — Componente `DetallePiezaPage` — muestra todos los campos, imagen Cloudinary y estados con color indicativo
- `frontend/src/pages/piezas/detalle/index.tsx` (L.23) — `useEffect` — carga la pieza con `readPieza(id)` al montar el componente
- `frontend/src/api/piezas.ts` (L.13–16) — Función `readPieza` — GET /piezas/:id
- `frontend/src/App.tsx` (L.76) — Ruta `/piezas/:id` — accesible para todos los roles autenticados

**Backend**
- `backend/src/services/piezas.service.ts` (L.63–68) — Función `obtener` — busca por id con populate de categoría y ubicación
- `backend/src/controllers/piezas.controller.ts` (L.35–38) — `@Get(':id')` — retorna pieza completa con datos de categoría y ubicación relacionados

### Criterios de aceptación
1. ✅ Muestra todos los campos: código, nombre, descripción, origen, dimensiones, categoría, ubicación, año aproximado, fecha de ingreso.
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.38–70) — llamadas a la función helper `campo(label, valor)`
   → `backend/src/services/piezas.service.ts` (L.65) — `.populate(['categoria', 'ubicacion'])` retorna los objetos completos
2. ✅ Muestra la imagen si existe (URL directa de Cloudinary).
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.33–36) — `{pieza.imagen && <img src={pieza.imagen} />}`
3. ✅ Muestra estado de la pieza y estado de conservación con color indicativo (verde/amarillo/rojo).
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.72–85) — badges con clases CSS condicionales por valor
4. ✅ Botón "Editar" visible solo para Administrador y Catalogador.
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.22) — `const puedeEditar = sesion?.rol === ROLES.ADMINISTRADOR || sesion?.rol === ROLES.CATALOGADOR`
5. ✅ Botón "Ver historial de movimientos" presente pero deshabilitado (disponible en Sprint 3).
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.91) — botón con atributo `disabled`
6. ✅ Botón "Volver" regresa al listado de inventario.
   → `frontend/src/pages/piezas/detalle/index.tsx` (L.89) — `navigate('/piezas')`

### Tareas
*(Incluida dentro de T-015 y T-016)*

---

## HU-009 — Modificar información de una pieza

**Descripción:** Como catalogador o administrador, quiero editar los datos de una pieza existente para corregir o actualizar su información, sin poder cambiar el código de inventario original.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/piezas/editar/index.tsx` (L.10–119) — Componente `EditarPiezaPage` — código solo lectura, demás campos editables
- `frontend/src/pages/piezas/editar/index.tsx` (L.40–54) — Función `handleSubmit` — envía cambios sin incluir codigoInventario
- `frontend/src/pages/piezas/editar/index.tsx` (L.63–71) — Modal de confirmación "¡Pieza actualizada!" con redirección automática al inventario
- `frontend/src/api/piezas.ts` (L.23–26) — Función `updatePieza` — PATCH /piezas/:id con multipart/form-data
- `frontend/src/api/ubicaciones.ts` (L.4–6) — Función `listUbicaciones` — carga el selector de ubicación en el formulario de edición

**Backend**
- `backend/src/dto/actualizar-pieza.dto.ts` (L.1–29) — Todos los campos opcionales; `codigoInventario` ausente — no es modificable
- `backend/src/services/piezas.service.ts` (L.71–85) — Función `actualizar` — aplica cambios incluyendo cambio de ubicación, sube nueva imagen si se envía
- `backend/src/controllers/piezas.controller.ts` (L.54–63) — `@Patch(':id')` — recibe cambios parciales e imagen opcional
- `backend/src/services/piezas.service.ts` (L.88–94) — Función `darDeBaja` — cambia estado a "Baja" y registra auditoría DELETE
- `backend/src/controllers/piezas.controller.ts` (L.67–70) — `@Delete(':id')` — baja lógica, solo Administrador

### Criterios de aceptación
1. ✅ Botón "Editar" disponible solo para Administrador y Catalogador.
   → `backend/src/controllers/piezas.controller.ts` (L.55) — `@Roles(RolEnum.ADMINISTRADOR, RolEnum.CATALOGADOR)` en PATCH
2. ✅ El código de inventario se muestra como texto (solo lectura), no es editable.
   → `frontend/src/pages/piezas/editar/index.tsx` (L.74–77) — `<p className="input bg-gray-100 cursor-not-allowed">{codigoActual}</p>`
   → `backend/src/dto/actualizar-pieza.dto.ts` (L.1–29) — `codigoInventario` no existe en el DTO
3. ✅ Se pueden modificar: nombre, descripción, origen, dimensiones, año aproximado, estado de conservación, categoría, ubicación e imagen.
   → `frontend/src/pages/piezas/editar/index.tsx` (L.80–115) — campos del formulario incluyendo selector de ubicación
4. ✅ El selector de ubicación muestra todas las ubicaciones registradas y permite cambiarla.
   → `frontend/src/pages/piezas/editar/index.tsx` (L.25–32) — `useEffect` llama a `listUbicaciones()` para cargar el `<select>`
5. ✅ Si se sube nueva imagen, se sube a Cloudinary y reemplaza la URL anterior.
   → `backend/src/services/piezas.service.ts` (L.82) — `if (file) pieza.imagen = await subirImagenCloudinary(file.buffer)`
6. ✅ Se registra auditoría `UPDATE` con usuario y fecha.
   → `backend/src/services/piezas.service.ts` (L.84) — `auditar(idAccion, 'UPDATE', id)`
7. ✅ Se muestra modal de confirmación al guardar exitosamente.
   → `frontend/src/pages/piezas/editar/index.tsx` (L.48) — `setExito(true)`
   → `frontend/src/pages/piezas/editar/index.tsx` (L.63–71) — modal con `/save.svg` y texto "¡Pieza actualizada!"
8. ✅ Solo el Administrador puede dar de baja (baja lógica — estado = "Baja", modal de confirmación).
   → `backend/src/controllers/piezas.controller.ts` (L.67–70) — `@Roles(RolEnum.ADMINISTRADOR)` en DELETE
   → `backend/src/services/piezas.service.ts` (L.88–94) — `pieza.estado = 'Baja'` + auditoría DELETE

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-018 | Implementar endpoint PATCH /piezas/:id sin modificar codigoInventario, permite cambiar ubicación, con auditoría | Backend |
| T-019 | Diseñar formulario de edición con código solo lectura, selector de ubicación precargado y baja lógica | Frontend |
