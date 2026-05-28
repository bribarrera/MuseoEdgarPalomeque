# Sprint 3 — Imágenes y Estado de Conservación

---

## HU-010 — Subir imagen de una pieza

**Descripción:** Como catalogador, quiero cargar una fotografía digital de la pieza para documentarla visualmente en el sistema. La imagen debe validarse por formato y tamaño.

### ¿Dónde está en el código?

**Frontend — Piezas**
- `frontend/src/pages/piezas/crear/index.tsx` (L.33–39) — Input de archivo con validación de tipos aceptados (JPG, PNG)
- `frontend/src/pages/piezas/crear/index.tsx` (L.28–30) — FormData que incluye la imagen en la carga a backend
- `frontend/src/api/piezas.ts` — Función `createPieza` envía multipart/form-data con imagen

**Backend — Cloudinary**
- `backend/src/config/cloudinary.ts` — Configuración y función `subirImagenCloudinary` para almacenamiento
- `backend/src/controllers/piezas.controller.ts` — Endpoint POST maneja Multer (memoryStorage) → Cloudinary

---

## HU-011 — Visualizar imagen de una pieza

**Descripción:** Como usuario, quiero ver la imagen asociada a una pieza en su detalle para identificarla visualmente.

### ¿Dónde está en el código?

**Frontend — Piezas**
- `frontend/src/pages/piezas/detalle/index.tsx` (L.50–55) — Renderiza imagen si existe o muestra placeholder
- `frontend/src/pages/piezas/detalle/index.tsx` (L.51) — Imagen en max-height 72 con object-cover

---

## HU-012 — Registrar estado de conservación

**Descripción:** Como catalogador, quiero documentar el estado físico actual de una pieza con nivel, observaciones y fecha para llevar registro de su condición.

### ¿Dónde está en el código?

**Frontend — Conservación**
- `frontend/src/pages/piezas/conservacion/crear/index.tsx` (L.8–64) — Componente `CrearConservacionPage` — formulario con selección de nivel (Excelente, Bueno, Regular, Malo) y textarea de observaciones
- `frontend/src/pages/piezas/conservacion/crear/index.tsx` (L.14–20) — Función `handleSubmit` — envía al backend y redirige al detalle
- `frontend/src/pages/piezas/detalle/index.tsx` (L.84–89) — Botón "+ Registrar estado" accesible solo para Admin/Catalogador
- `frontend/src/api/piezas.ts` — Función `createConservacion` — POST /piezas/:id/conservacion

**Backend — Conservación**
- `backend/src/models/auditoria.entity.ts` — Schema Mongoose que registra cambios en conservación
- `backend/src/services/piezas.service.ts` — Función que crea registro de conservación y actualiza estado actual

---

## HU-013 — Consultar historial de conservación

**Descripción:** Como usuario, quiero visualizar el historial completo de cambios de estado de conservación para conocer la evolución física de la pieza.

### ¿Dónde está en el código?

**Frontend — Conservación**
- `frontend/src/pages/piezas/conservacion/historial/index.tsx` (L.18–56) — Componente `HistorialConservacionPage` — muestra línea de tiempo cronológica
- `frontend/src/pages/piezas/conservacion/historial/index.tsx` (L.24–46) — Cada registro con código de color según nivel (verde/Excelente, azul/Bueno, naranja/Regular, rojo/Malo)
- `frontend/src/pages/piezas/conservacion/historial/index.tsx` (L.30–31) — Fecha y hora de registro + nombre de quien lo registró
- `frontend/src/pages/piezas/detalle/index.tsx` (L.90–92) — Botón "Ver historial" desde detalle de pieza
- `frontend/src/api/piezas.ts` — Función `getHistorialConservacion` — GET /piezas/:id/conservacion

**Backend — Conservación**
- `backend/src/controllers/piezas.controller.ts` — Endpoint GET /piezas/:id/conservacion retorna registros ordenados por fecha descendente
- `backend/src/models/conservacion.entity.ts` — Schema con referencias a Usuario registrado
