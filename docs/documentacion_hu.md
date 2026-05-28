# Documentación de Historias de Usuario — Sprint 1 al 3

---

## Sprint 1 — Autenticación y Gestión de Usuarios

HU-001: Como usuario del museo, quiero iniciar sesión con mi email y contraseña para acceder de forma segura al sistema de inventario.

Figura 13
Inicio de sesión
Nota. La imagen muestra el formulario de inicio de sesión de la aplicación.

---

HU-002: Como usuario del museo, quiero cerrar sesión de forma segura para proteger mi cuenta cuando termine de usar el sistema.

Figura 14
Cierre de sesión
Nota. La imagen muestra el botón de cierre de sesión disponible en la barra de navegación principal.

---

HU-003: Como administrador, quiero crear nuevos usuarios del museo asignándoles un rol específico para controlar quién tiene acceso al sistema.

Figura 15
Registro de usuario
Nota. La imagen muestra el formulario de creación de nuevos usuarios del sistema con campo de selección de rol.

---

HU-004: Como administrador, quiero ver la lista de todos los usuarios registrados para supervisar quién tiene acceso al sistema.

Figura 16
Listado de usuarios
Nota. La imagen muestra la tabla de gestión de usuarios con su información, estado y paginación.

---

HU-005: Como administrador, quiero editar la información de un usuario existente para actualizar su rol o datos personales.

Figura 17
Edición de usuario
Nota. La imagen muestra el formulario de edición de los datos de un usuario registrado en el sistema.

---

## Sprint 2 — Gestión del Inventario de Piezas Etnográficas

HU-006: Como administrador, quiero gestionar las categorías y ubicaciones disponibles para organizar correctamente el inventario etnográfico.

Figura 18
Gestión de categorías
Nota. La imagen muestra el módulo de administración de categorías disponibles para la clasificación de piezas.

---

Figura 19
Gestión de ubicaciones
Nota. La imagen muestra el módulo de administración de las ubicaciones físicas registradas en el museo.

---

HU-006 (cont.): Como catalogador, quiero registrar una nueva pieza en el inventario proporcionando su información completa para mantener el catálogo actualizado.

Figura 20
Registro de pieza etnográfica
Nota. La imagen muestra el formulario de registro de una pieza con todos sus campos requeridos y campo de carga de fotografía.

---

Figura 21
Confirmación de registro de pieza
Nota. La imagen muestra el modal de confirmación con el código de inventario asignado automáticamente a la pieza registrada.

---

HU-007: Como usuario del museo, quiero ver el listado completo de piezas del inventario para localizar objetos de la colección.

Figura 22
Inventario de piezas etnográficas
Nota. La imagen muestra la tabla del inventario con la barra de búsqueda y los selectores de filtrado por categoría, ubicación y estado de conservación.

---

HU-008: Como usuario del museo, quiero ver toda la información detallada de una pieza específica para consultar su registro completo.

Figura 23
Detalle de pieza etnográfica
Nota. La imagen muestra la vista de detalle de una pieza con todos sus campos descriptivos, fotografía y estado actual.

---

HU-009: Como catalogador, quiero editar la información de una pieza existente para mantener los datos actualizados y corregir errores.

Figura 24
Edición de pieza etnográfica
Nota. La imagen muestra el formulario de edición de una pieza con el código de inventario visible como campo de solo lectura.

---

## Sprint 3 — Registro Fotográfico y Estado de Conservación

HU-010: Como catalogador, quiero subir una imagen digital de la pieza para documentarla visualmente en el inventario.

Figura 25
Carga de fotografía de pieza
Nota. La imagen muestra el campo de selección de archivo de imagen dentro del formulario de registro de pieza.

---

HU-011: Como usuario del museo, quiero ver la imagen asociada a una pieza para identificarla visualmente.

Figura 26
Visualización de fotografía de pieza
Nota. La imagen muestra la fotografía de una pieza etnográfica almacenada en Cloudinary y presentada en la vista de detalle.

---

HU-012: Como catalogador, quiero documentar el estado actual de conservación de una pieza para llevar un registro de su condición física.

Figura 27
Registro de estado de conservación
Nota. La imagen muestra el formulario de registro del estado de conservación con selector de nivel y campo de observaciones.

---

HU-013: Como usuario del museo, quiero ver el historial completo de estados de conservación de una pieza para conocer su evolución física.

Figura 28
Historial de conservación
Nota. La imagen muestra el historial de estados de conservación de una pieza, presentado cronológicamente y codificado por color según el nivel registrado.

---

## Resúmenes de Sprint

### Resumen del Sprint 1

A continuación, en la Tabla 32, se muestra el resultado del sprint 1 donde se presentan las tareas realizadas, el tiempo estimado y el tiempo real.

En el primer sprint se desarrollaron las historias HU-001 a HU-005, que son las del login y la gestión de usuarios. Se hicieron 9 tareas en total. Se estimó un tiempo de 18 horas y al final se usaron 14 horas. Todo salió bien y no hubo errores que detuvieran el trabajo. Para el sprint 2 se acordó ir escribiendo comentarios en el código y usar siempre la misma forma para nombrar los componentes.

Tabla 32
Resumen del sprint 1
Tarea	Tiempo estimado	Tiempo real
T-001: Diseñar e implementar interfaz de login con validación de credenciales	2 horas	2 horas
T-002: Crear endpoint de autenticación y manejo de sesiones en backend	2 horas	2 horas
T-003: Implementar funcionalidad de cierre de sesión y destrucción de sesión	2 horas	1 hora
T-004: Diseñar formulario de creación de usuarios con validación de email único	2 horas	2 horas
T-005: Implementar encriptación de contraseñas y endpoint de registro de usuarios	2 horas	2 horas
T-006: Diseñar tabla de listado de usuarios con paginación	2 horas	1 hora
T-007: Crear endpoint de consulta de usuarios con filtros	2 horas	1 hora
T-008: Implementar formulario y endpoint de edición de usuarios con auditoría	2 horas	2 horas
T-009: Pruebas funcionales del módulo de autenticación y usuarios	2 horas	1 hora
Total	18 horas	14 horas

---

### Resumen del Sprint 2

A continuación, en la Tabla 33, se muestra el resultado del sprint 2 donde se presentan las tareas realizadas, el tiempo estimado y el tiempo real.

En el segundo sprint se desarrollaron las historias HU-006 a HU-009, que tienen que ver con el registro de piezas, el listado, el detalle y la edición. Se hicieron 9 tareas. El tiempo estimado fue de 20 horas y se terminó en 16 horas. Al hacer el formulario de edición se notó que no tenía el campo de ubicación y se añadió. Para el sprint 3 se configuró desde antes la conexión con Cloudinary para no perder tiempo cuando llegara la parte de imágenes.

Tabla 33
Resumen del sprint 2
Tarea	Tiempo estimado	Tiempo real
T-010: Diseñar modelo de datos y formulario de registro de piezas patrimoniales	2 horas	2 horas
T-011: Implementar validación de código único y endpoint de registro de piezas	2 horas	2 horas
T-012: Diseñar tabla de listado de piezas con buscador y filtros	2 horas	1 hora
T-013: Crear endpoint de consulta de piezas con paginación	2 horas	2 horas
T-014: Diseñar vista de detalle completo de pieza con información actualizada	2 horas	2 horas
T-015: Implementar endpoint de consulta individual de piezas	2 horas	2 horas
T-016: Diseñar formulario de edición de piezas con auditoría	2 horas	1 hora
T-017: Crear endpoint de actualización de piezas y registro de modificaciones	2 horas	2 horas
T-018: Pruebas funcionales del módulo de catalogación de piezas	4 horas	2 horas
Total	20 horas	16 horas

---

### Resumen del Sprint 3

A continuación, en la Tabla 34, se muestra el resultado del sprint 3 donde se presentan las tareas realizadas, el tiempo estimado y el tiempo real.

En el tercer sprint se trabajaron las historias HU-010 a HU-013 relacionadas con las fotos de piezas y el estado de conservación, con un total de 10 tareas. Se estimaron 22 horas y se usaron 17. Se encontró un error en el historial porque el campo de fecha tenía nombres distintos entre el backend y el frontend, y se corrigió.

Tabla 34
Resumen del sprint 3
Tarea	Tiempo estimado	Tiempo real
T-019: Diseñar componente de carga de imágenes con previsualización	2 horas	2 horas
T-020: Implementar validación de formato tamaño y almacenamiento de imágenes	2 horas	1 hora
T-021: Crear endpoint para subir y asociar imágenes con piezas	2 horas	2 horas
T-022: Implementar visualización de imágenes con placeholder predeterminado	2 horas	2 horas
T-023: Diseñar modelo de datos para estados de conservación	2 horas	1 hora
T-024: Diseñar formulario de registro de estado de conservación	2 horas	2 horas
T-025: Crear endpoint para registrar y actualizar estado actual de piezas	2 horas	2 horas
T-026: Diseñar vista de historial de conservación ordenado cronológicamente	2 horas	1 hora
T-027: Implementar endpoint de consulta de historial de conservación	2 horas	2 horas
T-028: Pruebas funcionales de imágenes y estados de conservación	4 horas	2 horas
Total	22 horas	17 horas
