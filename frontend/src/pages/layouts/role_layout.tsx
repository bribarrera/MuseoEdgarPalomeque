// role_layout.tsx — protege rutas por rol, muestra 403 si no tiene permiso
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';

interface Props { roles: string[] }

export default function RoleLayout({ roles }: Props) {
  const { sesion } = useAuth();
  if (!sesion) return <Navigate to="/login" replace />;
  if (!roles.includes(sesion.rol)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-lg font-semibold">Acceso denegado (403)</p>
      </div>
    );
  }
  return <Outlet />;
}
