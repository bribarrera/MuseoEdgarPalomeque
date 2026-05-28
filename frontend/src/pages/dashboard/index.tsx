// index.tsx — página principal del dashboard (HU-019, HU-020)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth_context';
import { getEstadisticas } from '../../api/piezas';
import { ROLES } from '../../api/http_client';
import EstadisticasSection, { Estadisticas } from './estadisticas';

const modulos = [
  {
    titulo: 'Inventario', desc: 'Consultar y gestionar piezas', ruta: '/piezas',
    roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR, ROLES.CONSULTOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-9-4h2M8 3h2m4 0h2M3 13h18" />
      </svg>
    ),
  },
  {
    titulo: 'Búsqueda Avanzada', desc: 'Filtros combinados', ruta: '/piezas/busqueda',
    roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR, ROLES.CONSULTOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
    ),
  },
  {
    titulo: 'Movimientos', desc: 'Traslados y préstamos', ruta: '/movimientos',
    roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    titulo: 'Reportes', desc: 'Descargar PDF', ruta: '/reportes',
    roles: [ROLES.ADMINISTRADOR, ROLES.CATALOGADOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    titulo: 'Usuarios', desc: 'Gestión de accesos', ruta: '/usuarios',
    roles: [ROLES.ADMINISTRADOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 00-5.196-3.796M9 20H4v-1a4 4 0 015.196-3.796M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 13v-1a4 4 0 00-3-3.87" />
      </svg>
    ),
  },
  {
    titulo: 'Categorías', desc: 'Clasificaciones', ruta: '/categorias',
    roles: [ROLES.ADMINISTRADOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    titulo: 'Ubicaciones', desc: 'Salas y depósitos', ruta: '/ubicaciones',
    roles: [ROLES.ADMINISTRADOR],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Estadisticas | null>(null);

  useEffect(() => { getEstadisticas().then(setStats).catch(() => {}); }, []);

  return (
    <div className="space-y-6">

      {/* Banner de bienvenida */}
      <div className="bg-gradient-to-r from-[#6B0F0F] to-[#9B1C1C] rounded-xl p-5 text-white shadow-md">
        <p className="text-sm text-red-200">Bienvenido,</p>
        <p className="text-xl font-bold">{sesion?.nombres} {sesion?.apellidos}</p>
        <p className="text-sm text-red-200 mt-0.5">{sesion?.rol}</p>
      </div>

      {/* Métricas, gráficos y alertas */}
      <EstadisticasSection stats={stats} />

      {/* Accesos rápidos a módulos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-gray-300" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acceso rápido</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {modulos.map((m) => {
            const permitido = sesion?.rol ? (m.roles as string[]).includes(sesion.rol) : false;
            return (
              <button
                key={m.titulo}
                disabled={!permitido}
                onClick={() => navigate(m.ruta)}
                className={`group p-4 rounded-2xl text-left border transition-all ${
                  permitido
                    ? 'bg-white border-gray-200 hover:border-[#6B0F0F] hover:shadow-md cursor-pointer'
                    : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-50'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  permitido ? 'bg-gray-100 group-hover:bg-[#6B0F0F]/10 text-gray-500 group-hover:text-[#6B0F0F]' : 'bg-gray-100 text-gray-400'
                }`}>
                  {m.icon}
                </div>
                <p className={`text-sm font-bold transition-colors ${permitido ? 'text-gray-800 group-hover:text-[#6B0F0F]' : 'text-gray-400'}`}>
                  {m.titulo}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
