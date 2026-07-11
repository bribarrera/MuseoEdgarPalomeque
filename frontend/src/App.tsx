// App.tsx — enrutador principal
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AuthProvider } from './context/auth_context';
import { LoadingProvider, useLoading } from './context/loading_context';
import { ROLES } from './api/http_client';

function NavigationWatcher() {
  const location = useLocation();
  const { setLoading } = useLoading();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return null;
}

import SessionLayout  from './pages/layouts/session_layout';
import RoleLayout     from './pages/layouts/role_layout';

import LoginPage         from './pages/login';
import DashboardPage     from './pages/dashboard';
import UsuariosPage      from './pages/usuarios/index';
import CrearUsuarioPage  from './pages/usuarios/crear/index';
import EditarUsuarioPage from './pages/usuarios/editar/index';
import PiezasPage        from './pages/piezas/index';
import CrearPiezaPage    from './pages/piezas/crear/index';
import EditarPiezaPage   from './pages/piezas/editar/index';
import DetallePiezaPage  from './pages/piezas/detalle/index';
import CrearConservacionPage from './pages/piezas/conservacion/crear/index';
import HistorialConservacionPage from './pages/piezas/conservacion/historial/index';
import CrearMovimientoPage from './pages/piezas/movimientos/crear/index';
import HistorialMovimientosPage from './pages/piezas/movimientos/historial/index';
import MovimientosPage from './pages/movimientos/index';
import CategoriasPage    from './pages/categorias/index';
import CrearCategoriaPage from './pages/categorias/crear/index';
import EditarCategoriaPage from './pages/categorias/editar/index';
import UbicacionesPage   from './pages/ubicaciones/index';
import CrearUbicacionPage from './pages/ubicaciones/crear/index';
import EditarUbicacionPage from './pages/ubicaciones/editar/index';
import BusquedaAvanzadaPage from './pages/piezas/busqueda/index';
import PiezaPublicPage from './pages/piezas/public/index';
import PiezaQRPage from './pages/piezas/qr/index';
import ReportesPage from './pages/reportes/index';
import AuditoriaPage from './pages/auditoria/index';

export default function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
      <AuthProvider>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/piezas/public/:id" element={<PiezaPublicPage />} />
          <Route path="/piezas/:id/qr" element={<PiezaQRPage />} />

          {/* Rutas protegidas por sesión */}
          <Route element={<SessionLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Solo Administrador */}
            <Route element={<RoleLayout roles={[ROLES.ADMINISTRADOR]} />}>
              <Route path="/usuarios"                   element={<UsuariosPage />} />
              <Route path="/usuarios/crear"             element={<CrearUsuarioPage />} />
              <Route path="/usuarios/editar/:id"        element={<EditarUsuarioPage />} />
              <Route path="/categorias"                 element={<CategoriasPage />} />
              <Route path="/categorias/crear"           element={<CrearCategoriaPage />} />
              <Route path="/categorias/editar/:id"      element={<EditarCategoriaPage />} />
              <Route path="/ubicaciones"                element={<UbicacionesPage />} />
              <Route path="/ubicaciones/crear"          element={<CrearUbicacionPage />} />
              <Route path="/ubicaciones/editar/:id"     element={<EditarUbicacionPage />} />
              {/* Sprint 6 — Auditoría HU-023 */}
              <Route path="/auditoria"                  element={<AuditoriaPage />} />
            </Route>

            {/* Administrador y Catalogador */}
            <Route element={<RoleLayout roles={[ROLES.ADMINISTRADOR, ROLES.CATALOGADOR]} />}>
              <Route path="/piezas/crear"               element={<CrearPiezaPage />} />
              <Route path="/piezas/editar/:id"          element={<EditarPiezaPage />} />
              <Route path="/piezas/:id"                 element={<DetallePiezaPage />} />
            </Route>

            {/* Todos los roles autenticados */}
            <Route path="/piezas"                       element={<PiezasPage />} />

            {/* Sprint 3 — Conservación (Catalogador y Admin) */}
            <Route element={<RoleLayout roles={[ROLES.ADMINISTRADOR, ROLES.CATALOGADOR]} />}>
              <Route path="/piezas/:id/conservacion/crear" element={<CrearConservacionPage />} />
              <Route path="/piezas/:id/conservacion/historial" element={<HistorialConservacionPage />} />
            </Route>

            {/* Sprint 4 — Movimientos (Catalogador y Admin) */}
            <Route element={<RoleLayout roles={[ROLES.ADMINISTRADOR, ROLES.CATALOGADOR]} />}>
              <Route path="/piezas/:id/movimientos/crear" element={<CrearMovimientoPage />} />
              <Route path="/movimientos" element={<MovimientosPage />} />
            </Route>

            {/* Sprint 4 — Trazabilidad (todos los roles) */}
            <Route path="/piezas/:id/movimientos/historial" element={<HistorialMovimientosPage />} />

            {/* búsqueda avanzada (HU-018) */}
            <Route path="/piezas/busqueda" element={<BusquedaAvanzadaPage />} />

            {/* reportes PDF (HU-021, HU-022) */}
            <Route element={<RoleLayout roles={[ROLES.ADMINISTRADOR, ROLES.CATALOGADOR]} />}>
              <Route path="/reportes" element={<ReportesPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <NavigationWatcher />
      </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}
