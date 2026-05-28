# Sprint 1 — Autenticación y Gestión de Usuarios

---

## HU-001 — Iniciar sesión en el sistema

**Descripción:** Como usuario del museo, quiero iniciar sesión con mi email y contraseña para acceder de forma segura al sistema de inventario.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/login.tsx` (L.8–77) — Componente `LoginPage` — formulario de login con email, contraseña y manejo de error
- `frontend/src/api/auth.ts` (L.5–7) — Función `loginRequest` — envía email y contraseña al backend
- `frontend/src/context/auth_context.tsx` (L.27–30) — Función `iniciarSesion` — guarda el token JWT y datos de usuario en localStorage
- `frontend/src/pages/layouts/session_layout.tsx` (L.6–17) — Componente `SessionLayout` — bloquea páginas sin sesión activa, redirige a /login

**Backend**
- `backend/src/controllers/auth.controller.ts` (L.13–15) — `@Post('login')` — recibe las credenciales del frontend
- `backend/src/services/auth.service.ts` (L.20–51) — Función `login` — valida email, compara hash bcrypt y firma el JWT
- `backend/src/guards/jwt.strategy.ts` (L.17–18) — Función `validate` — extrae y verifica el payload del token en cada petición protegida
- `backend/src/dto/login.dto.ts` (L.1–11) — Valida que el email sea válido y la contraseña no esté vacía

### Criterios de aceptación
1. ✅ Existe formulario con campos de email y contraseña.
   → `frontend/src/pages/login.tsx` (L.62–65)
2. ✅ El sistema valida las credenciales contra la base de datos.
   → `backend/src/services/auth.service.ts` (L.21–27) — busca el usuario y compara el hash bcrypt
3. ✅ Si son correctas → redirige al dashboard principal.
   → `frontend/src/pages/login.tsx` (L.23) — `navigate('/dashboard')`
4. ✅ Si son incorrectas → muestra mensaje de error claro.
   → `frontend/src/pages/login.tsx` (L.25–26) — `setError('Correo o contraseña incorrectos.')`
5. ✅ La contraseña está oculta mientras se escribe.
   → `frontend/src/pages/login.tsx` (L.64) — `type="password"`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-001 | Diseñar e implementar interfaz de login con validación de credenciales | Frontend |
| T-002 | Crear endpoint de autenticación y manejo de sesiones en backend | Backend |

---

## HU-002 — Cerrar sesión del sistema

**Descripción:** Como usuario del museo, quiero cerrar sesión de forma segura para proteger mi cuenta cuando termine de usar el sistema.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/components/navbar.tsx` (L.12–18) — Función `logout` — llama al backend y limpia la sesión local
- `frontend/src/pages/components/navbar.tsx` (L.26–28) — Botón "Cerrar sesión" visible en la barra superior
- `frontend/src/context/auth_context.tsx` (L.32–36) — Función `cerrarSesion` — elimina token y sesión del localStorage
- `frontend/src/api/auth.ts` (L.9–11) — Función `logoutRequest` — POST /auth/logout
- `frontend/src/pages/layouts/session_layout.tsx` (L.7–8) — Redirige a /login automáticamente si no hay sesión activa

**Backend**
- `backend/src/controllers/auth.controller.ts` (L.19–23) — `@Post('logout')` — recibe la petición de cierre de sesión
- `backend/src/services/auth.service.ts` (L.53–56) — Función `logout` — registra auditoría LOGOUT

### Criterios de aceptación
1. ✅ Existe un botón "Cerrar sesión" visible en el menú principal.
   → `frontend/src/pages/components/navbar.tsx` (L.26–28) — botón con clase `btn-red`
2. ✅ Al cerrar sesión redirige automáticamente a la pantalla de login.
   → `frontend/src/pages/components/navbar.tsx` (L.16–17) — `cerrarSesion()` + `navigate('/login')`
3. ✅ No se puede acceder con el botón "atrás" del navegador después de cerrar sesión.
   → `frontend/src/pages/layouts/session_layout.tsx` (L.7–8) — `if (!sesion) return <Navigate to="/login" replace />`

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-003 | Implementar funcionalidad de cierre de sesión y destrucción de sesión | Frontend / Backend |

---

## HU-003 — Crear usuario del museo

**Descripción:** Como administrador, quiero crear nuevos usuarios del museo asignándoles un rol específico para controlar quién tiene acceso al sistema.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/usuarios/crear/index.tsx` (L.11–65) — Componente `CrearUsuarioPage` — formulario con campos y selector de rol
- `frontend/src/pages/usuarios/crear/index.tsx` (L.23–39) — Función `handleSubmit` — envía los datos al backend

**Backend**
- `backend/src/controllers/usuarios.controller.ts` (L.19–21) — `@Post()` — endpoint de creación (solo Administrador)
- `backend/src/services/usuarios.service.ts` (L.22–40) — Función `crear` — valida email único, hashea contraseña con bcrypt y registra auditoría
- `backend/src/dto/crear-usuario.dto.ts` (L.1–22) — Valida email, contraseña, nombres, apellidos e idRol

### Criterios de aceptación
1. ✅ Botón "Crear usuario" accesible solo para administradores.
   → `backend/src/controllers/usuarios.controller.ts` (L.12–13) — `@Roles(RolEnum.ADMINISTRADOR)`
2. ✅ Campos obligatorios: nombre completo, email único, contraseña y rol.
   → `backend/src/dto/crear-usuario.dto.ts` (L.1–22) — decoradores `@IsNotEmpty` y `@IsEmail`
3. ✅ El email se valida para evitar duplicados.
   → `backend/src/services/usuarios.service.ts` (L.24–26) — `findOne({ email })` lanza `ConflictException`
4. ✅ La contraseña cumple requisitos mínimos (8 caracteres, mayúsculas, números).
   → `backend/src/dto/crear-usuario.dto.ts` (L.12–15) — `@MinLength(8)` y `@Matches`
5. ✅ El nuevo usuario aparece en la lista al ser creado.
   → `frontend/src/pages/usuarios/crear/index.tsx` (L.28) — `navigate('/usuarios')` al guardar

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-004 | Diseñar formulario de creación de usuarios con validación de email único | Frontend |
| T-005 | Implementar encriptación de contraseñas y endpoint de registro de usuarios | Backend |

---

## HU-004 — Consultar lista de usuarios

**Descripción:** Como administrador, quiero ver la lista de todos los usuarios registrados para supervisar quién tiene acceso al sistema.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/usuarios/index.tsx` (L.11–115) — Componente `UsuariosPage` — tabla con paginación y botones de acción por fila
- `frontend/src/pages/usuarios/index.tsx` (L.19–23) — Función `cargar` — llama a `listUsuarios` con parámetros de paginación

**Backend**
- `backend/src/controllers/usuarios.controller.ts` (L.25–33) — `@Get()` — retorna lista paginada de usuarios
- `backend/src/services/usuarios.service.ts` (L.43–51) — Función `listar` — retorna usuarios activos sin exponer password_hash
- `backend/src/models/usuario.entity.ts` (L.21) — Campo `passwordHash` con `select: false` — nunca se expone en respuestas

### Criterios de aceptación
1. ✅ Tabla con nombre, email, rol y estado de cada usuario.
   → `frontend/src/pages/usuarios/index.tsx` (L.65–75) — columnas de la tabla `<th>`/`<td>`
2. ✅ La contraseña NO es visible en ningún momento.
   → `backend/src/models/usuario.entity.ts` (L.21) — `select: false` en el campo `passwordHash`
3. ✅ Permite ordenar por nombre o fecha de creación.
   → `backend/src/services/usuarios.service.ts` (L.46) — `.sort({ nombres: 1 })`
4. ✅ Incluye paginación si hay más de 10 usuarios.
   → `frontend/src/pages/usuarios/index.tsx` (L.90–100) — botones numéricos de página

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-006 | Diseñar tabla de listado de usuarios con paginación | Frontend |
| T-007 | Crear endpoint de consulta de usuarios con filtros | Backend |

---

## HU-005 — Modificar información de usuario

**Descripción:** Como administrador, quiero editar la información de un usuario existente para actualizar su rol o datos personales.

### ¿Dónde está en el código?

**Frontend**
- `frontend/src/pages/usuarios/editar/index.tsx` (L.10–80) — Componente `EditarUsuarioPage` — carga y edita datos del usuario
- `frontend/src/pages/usuarios/editar/index.tsx` (L.25–36) — Función `handleSubmit` — envía los cambios y muestra modal de confirmación

**Backend**
- `backend/src/controllers/usuarios.controller.ts` (L.40–47) — `@Patch(':id')` — endpoint de edición (solo Administrador)
- `backend/src/services/usuarios.service.ts` (L.62–83) — Función `actualizar` — aplica los cambios y registra auditoría UPDATE
- `backend/src/models/auditoria.entity.ts` (L.1–31) — Schema `Auditoria` — registra CREATE / UPDATE / DELETE con usuario y fecha

### Criterios de aceptación
1. ✅ Botón "Editar" disponible en cada fila de la lista de usuarios.
   → `frontend/src/pages/usuarios/index.tsx` (L.78) — botón que navega a `/usuarios/:id/editar`
2. ✅ Se pueden modificar nombre, email y rol.
   → `frontend/src/pages/usuarios/editar/index.tsx` (L.55–75) — campos del formulario de edición
3. ✅ El sistema registra automáticamente quién hizo el cambio y cuándo.
   → `backend/src/services/usuarios.service.ts` (L.82) — `auditar(idAccion, 'UPDATE', id)`
4. ✅ Se muestra mensaje de confirmación al guardar.
   → `frontend/src/pages/usuarios/editar/index.tsx` (L.44–52) — modal con `/save.svg` y texto "¡Usuario actualizado!"

### Tareas
| ID | Tarea | Capa |
|----|-------|------|
| T-008 | Implementar formulario y endpoint de edición de usuarios con auditoría | Frontend / Backend |
| T-009 | Pruebas funcionales del módulo de autenticación y usuarios | Frontend / Backend |
