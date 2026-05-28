// movimientos/index.tsx — HU-016: movimientos recientes del inventario
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovimientosRecientes } from '../../api/piezas';

interface Movimiento {
  _id: string;
  tipoMovimiento: string;
  idPieza: { nombre: string; codigoInventario: string };
  ubicacionOrigen: { nombre: string };
  ubicacionDestino: { nombre: string };
  fechaSalida: string;
  responsable: string;
}

const LIMITE = 20;

export default function MovimientosPage() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<Movimiento[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = async (p: number) => {
    setCargando(true);
    const data = await getMovimientosRecientes(p, LIMITE, desde || undefined, hasta || undefined);
    setDatos(data.datos);
    setTotalPaginas(data.totalPaginas);
    setCargando(false);
  };

  useEffect(() => { cargar(pagina); }, [pagina, desde, hasta]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Movimientos del Inventario</h2>
      </div>

      {/* Filtro por fechas — HU-016 CA-3 */}
      <div className="flex gap-3 mb-4 flex-wrap items-end">
        <div>
          <label className="label">Desde</label>
          <input type="date" className="input" value={desde}
            onChange={(e) => { setDesde(e.target.value); setPagina(1); }} />
        </div>
        <div>
          <label className="label">Hasta</label>
          <input type="date" className="input" value={hasta}
            onChange={(e) => { setHasta(e.target.value); setPagina(1); }} />
        </div>
        {(desde || hasta) && (
          <button className="btn-gray" onClick={() => { setDesde(''); setHasta(''); setPagina(1); }}>
            Limpiar
          </button>
        )}
      </div>

      {cargando ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : datos.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">Sin movimientos registrados</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Pieza</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Origen</th>
                <th className="px-4 py-3 text-left">Destino</th>
                <th className="px-4 py-3 text-left">Responsable</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {datos.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {new Date(m.fechaSalida).toLocaleDateString('es-EC')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{m.idPieza?.nombre ?? '—'}</p>
                    <p className="text-xs font-mono text-gray-400">{m.idPieza?.codigoInventario}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.tipoMovimiento}</td>
                  <td className="px-4 py-3 text-gray-600">{m.ubicacionOrigen?.nombre ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{m.ubicacionDestino?.nombre ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{m.responsable}</td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-gray-500 hover:bg-gray-600 rounded p-1.5 transition-colors text-white text-xs"
                      onClick={() => navigate(`/piezas/${(m.idPieza as unknown as { _id: string })?._id ?? ''}/movimientos/historial`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación — HU-016 CA-4 */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button className="btn-gray" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
            ‹ Anterior
          </button>
          <span className="text-sm text-gray-500 self-center">
            Página {pagina} de {totalPaginas}
          </span>
          <button className="btn-gray" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>
            Siguiente ›
          </button>
        </div>
      )}
    </div>
  );
}
