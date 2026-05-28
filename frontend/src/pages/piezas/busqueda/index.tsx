// piezas/busqueda/index.tsx — búsqueda avanzada por criterios múltiples (HU-018)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPiezas } from '../../../api/piezas';
import { listCategorias, CategoriaOpcion } from '../../../api/categorias';
import { listUbicaciones, UbicacionOpcion } from '../../../api/ubicaciones';

interface Pieza {
  idPieza: string;
  codigoInventario: string;
  nombre: string;
  estadoConservacion: string;
  categoria: { nombre: string };
  ubicacion: { nombre: string };
}

const colorNivel: Record<string, string> = {
  Excelente: 'text-green-700 bg-green-50',
  Bueno:     'text-blue-700 bg-blue-50',
  Regular:   'text-yellow-700 bg-yellow-50',
  Malo:      'text-red-700 bg-red-50',
};

export default function BusquedaAvanzadaPage() {
  const navigate = useNavigate();
  const [busqueda,    setBusqueda]    = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [idUbicacion, setIdUbicacion] = useState('');
  const [categorias,  setCategorias]  = useState<CategoriaOpcion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOpcion[]>([]);
  const [resultados,  setResultados]  = useState<Pieza[] | null>(null);
  const [total,       setTotal]       = useState(0);
  const [cargando,    setCargando]    = useState(false);

  useEffect(() => {
    listCategorias().then(setCategorias);
    listUbicaciones().then(setUbicaciones);
  }, []);

  const buscar = async () => {
    setCargando(true);
    try {
      const data = await listPiezas(1, 50, busqueda || undefined, idCategoria || undefined, idUbicacion || undefined);
      setResultados(data.datos);
      setTotal(data.total ?? data.datos.length);
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => {
    setBusqueda('');
    setIdCategoria('');
    setIdUbicacion('');
    setResultados(null);
    setTotal(0);
  };

  const hayFiltros = busqueda || idCategoria || idUbicacion;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Búsqueda Avanzada de Piezas</h2>

        {/* formulario de filtros combinados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
        <p className="text-xs text-gray-400 mb-3">
          Combine uno o más criterios para localizar piezas específicas del inventario.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="label">Código o Nombre</label>
            <input
              className="input w-full"
              placeholder="Ej. MEP-001 o vasija..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
            />
          </div>
          <div>
            <label className="label">Categoría</label>
            <select className="input w-full" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ubicación actual</label>
            <select className="input w-full" value={idUbicacion} onChange={(e) => setIdUbicacion(e.target.value)}>
              <option value="">Todas las ubicaciones</option>
              {ubicaciones.map((u) => (
                <option key={u.idUbicacion} value={u.idUbicacion}>{u.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-blue" onClick={buscar} disabled={cargando || !hayFiltros}>
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
          {resultados !== null && (
            <button className="btn-gray" onClick={limpiar}>Limpiar filtros</button>
          )}
        </div>
      </div>

      {/* resultados */}
      {resultados !== null && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            {total === 0
              ? 'Sin resultados para los criterios ingresados.'
              : `${total} pieza${total > 1 ? 's' : ''} encontrada${total > 1 ? 's' : ''}`}
          </p>

          {total > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">Nombre</th>
                    <th className="px-4 py-3 text-left">Categoría</th>
                    <th className="px-4 py-3 text-left">Ubicación</th>
                    <th className="px-4 py-3 text-left">Conservación</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resultados.map((p) => (
                    <tr key={p.idPieza} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">{p.codigoInventario}</td>
                      <td className="px-4 py-2 font-medium text-gray-800">{p.nombre}</td>
                      <td className="px-4 py-2 text-gray-600">{p.categoria?.nombre ?? '—'}</td>
                      <td className="px-4 py-2 text-gray-600">{p.ubicacion?.nombre ?? '—'}</td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colorNivel[p.estadoConservacion] ?? 'text-gray-600 bg-gray-50'}`}>
                          {p.estadoConservacion}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => navigate(`/piezas/${p.idPieza}`)}>
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
