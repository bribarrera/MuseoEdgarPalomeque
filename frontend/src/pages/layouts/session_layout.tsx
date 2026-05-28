// session_layout.tsx — protege rutas, redirige a /login si no hay sesión
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';
import Sidebar from '../components/sidebar';

export default function SessionLayout() {
  const { sesion } = useAuth();
  if (!sesion) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
