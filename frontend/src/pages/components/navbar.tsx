// navbar.tsx — barra de navegación con logout (HU-002)
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';
import { useLoading } from '../../context/loading_context';
import { logoutRequest } from '../../api/auth';

export default function Navbar() {
  const { sesion, cerrarSesion } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    await logoutRequest();
    setTimeout(() => {
      cerrarSesion();
      navigate('/login');
    }, 1200);
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <span className="font-bold text-lg">Museo Etnográfico</span>
      <div className="flex items-center gap-4 text-sm">
        <span>{sesion?.nombres} {sesion?.apellidos} · {sesion?.rol}</span>
        <button onClick={logout} className="btn-red text-xs py-1 px-3">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
