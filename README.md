# Sistema de Gestión de Inventario — Museo Etnográfico "Edgar Palomeque"

## Tecnologías

**Backend:** NestJS · MongoDB (Atlas) · Mongoose · JWT · Cloudinary · PDFKit  
**Frontend:** React 18 · TypeScript · Vite · Tailwind CSS · Axios · React Router v6

## Ejecutar en local

```bash
# Instalar dependencias
npm run install:all

# Iniciar backend y frontend juntos
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:3000/api

## Variables de entorno

Crear `backend/.env` con:

```
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=30m
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
