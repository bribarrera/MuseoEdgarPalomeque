// sidebar.tsx — navegación lateral HU-002
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';
import { useLoading } from '../../context/loading_context';
import { logoutRequest } from '../../api/auth';
import { ROLES } from '../../api/http_client';

const items = [
  {
    label: 'Inicio', path: '/dashboard', roles: null,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  },
  {
    label: 'Inventario', path: '/piezas', roles: null,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  },
  {
    label: 'Búsqueda Avanzada', path: '/piezas/busqueda', roles: null,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />,
  },
  {
    label: 'Movimientos', path: '/movimientos', roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR],
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
  },
  {
    label: 'Reportes', path: '/reportes', roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR],
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    label: 'Categorías', path: '/categorias', roles: [ROLES.ADMINISTRADOR],
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
  },
  {
    label: 'Ubicaciones', path: '/ubicaciones', roles: [ROLES.ADMINISTRADOR],
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
  },
  {
    label: 'Usuarios', path: '/usuarios', roles: [ROLES.ADMINISTRADOR],
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  },
  {
    label: 'Auditoría', path: '/auditoria', roles: [ROLES.ADMINISTRADOR],
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
];

export default function Sidebar() {
  const { sesion, cerrarSesion } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    await logoutRequest();
    setTimeout(() => { cerrarSesion(); navigate('/login'); }, 1200);
  };

  const visibles = items.filter(
    (i) => !i.roles || (sesion?.rol && (i.roles as string[]).includes(sesion.rol))
  );

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-[#6B0F0F] text-white z-40">
      {/* Logo y nombre */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-red-900">
        <div className="w-20 h-20 rounded-lg bg-white/10 overflow-hidden mb-3 flex items-center justify-center">
          <img src="/login.jpeg" alt="" role="presentation" className="w-full h-full object-cover" />
        </div>
        <p className="text-sm font-bold text-center leading-tight">Museo Etnográfico</p>
        <p className="text-sm font-bold text-center leading-tight text-red-300">"Edgar Palomeque"</p>
        <p className="text-xs text-white/80 mt-1 text-center">Sistema de Gestión Cultural</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-3">
        {visibles.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-red-600 text-white' : 'text-red-100 hover:bg-red-900'
              }`
            }
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              {item.icon}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t border-red-900 p-3">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-100 hover:bg-red-900 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
