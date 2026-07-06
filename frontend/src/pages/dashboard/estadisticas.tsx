// estadisticas.tsx — tarjetas de métricas, gráficos y alertas (HU-019, HU-020)
import { useNavigate } from 'react-router-dom';

export interface Estadisticas {
  totalActivas: number;
  movimientosMes: number;
  malEstado: number;
  porConservacion: { _id: string; total: number }[];
  alertas: { idPieza: string; codigoInventario: string; nombre: string; estadoConservacion: string; ubicacion: { nombre: string } }[];
  porCategoria: { nombre: string; total: number }[];
}


const barColor: Record<string, string> = {
  Excelente: '#10b981',
  Bueno:     '#3b82f6',
  Regular:   '#f59e0b',
  Malo:      '#ef4444',
};

interface Props {
  stats: Estadisticas | null;
}

export default function EstadisticasSection({ stats }: Props) {
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse">
            <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const maxCat = stats.porCategoria?.[0]?.total ?? 1;

  return (
    <>
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Piezas activas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6B0F0F]/10 flex items-center justify-center shrink-0">
            <svg aria-hidden="true" className="w-6 h-6 text-[#6B0F0F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Piezas registradas</p>
            <p className="text-4xl font-bold text-gray-900 mt-0.5 leading-none" role="img" aria-label={`${stats.totalActivas} piezas registradas`}>{stats.totalActivas}</p>
            <p className="text-xs text-gray-600 mt-1">en el inventario activo</p>
          </div>
        </div>

        {/* Movimientos del mes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <svg aria-hidden="true" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Movimientos este mes</p>
            <p className="text-4xl font-bold text-blue-600 mt-0.5 leading-none" role="img" aria-label={`${stats.movimientosMes} movimientos este mes`}>{stats.movimientosMes}</p>
            <p className="text-xs text-gray-600 mt-1">traslados y préstamos</p>
          </div>
        </div>

        {/* Mal estado */}
        <div className="rounded-2xl shadow-sm border p-5 flex items-start gap-4 bg-white border-gray-100">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
            <svg aria-hidden="true" className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Piezas en mal estado</p>
            <p className="text-4xl font-bold mt-0.5 leading-none text-gray-900" role="img" aria-label={`${stats.malEstado} piezas en mal estado`}>{stats.malEstado}</p>
            <p className="text-xs text-gray-600 mt-1">requieren intervención urgente</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estado de conservación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-[#6B0F0F]" />
            <h2 className="text-sm font-bold text-gray-800">Estado de conservación</h2>
          </div>
          <div className="space-y-3">
            {['Excelente', 'Bueno', 'Regular', 'Malo'].map((nivel) => {
              const item = stats.porConservacion.find((c) => c._id === nivel);
              const total = item?.total ?? 0;
              const pct = stats.totalActivas > 0 ? Math.round((total / stats.totalActivas) * 100) : 0;
              return (
                <div key={nivel}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{nivel}</span>
                    <span className="text-xs font-bold text-gray-700">{total} <span className="font-normal text-gray-600">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: barColor[nivel] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Piezas por categoría */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-[#6B0F0F]" />
            <h2 className="text-sm font-bold text-gray-800">Piezas por categoría</h2>
          </div>
          <div className="space-y-3">
            {stats.porCategoria.length === 0 && (
              <p className="text-xs text-gray-600">Sin datos</p>
            )}
            {stats.porCategoria.map((c) => {
              const pct = Math.round((c.total / maxCat) * 100);
              return (
                <div key={c.nombre}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[70%]">{c.nombre}</span>
                    <span className="text-xs font-bold text-gray-700">{c.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-[#6B0F0F] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, opacity: 0.75 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alertas de conservación */}
      {stats.alertas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border-b border-amber-100">
            <svg aria-hidden="true" className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            <h2 className="text-sm font-bold text-amber-800">
              Piezas que requieren atención
              <span className="ml-2 bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">{stats.alertas.length}</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-2.5">Código</th>
                  <th className="text-left px-4 py-2.5">Nombre</th>
                  <th className="text-left px-4 py-2.5">Estado</th>
                  <th className="text-left px-4 py-2.5">Ubicación</th>
                  <th className="px-4 py-2.5" aria-label="Acciones" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.alertas.map((a) => (
                  <tr key={a.idPieza} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 font-mono text-xs text-gray-600">{a.codigoInventario}</td>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{a.nombre}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-gray-700">{a.estadoConservacion}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600">{a.ubicacion?.nombre ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => navigate(`/piezas/${a.idPieza}`)}
                        className="text-xs text-[#6B0F0F] hover:underline font-medium">
                        Ver detalle →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
