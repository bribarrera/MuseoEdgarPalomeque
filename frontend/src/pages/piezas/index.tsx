// piezas/index.tsx — HU-007: inventario con búsqueda, filtros y paginación · HU-006 baja lógica
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPiezas, deletePieza } from '../../api/piezas';
import { listCategorias, CategoriaOpcion } from '../../api/categorias';
import { listUbicaciones, UbicacionOpcion } from '../../api/ubicaciones';
import { useAuth } from '../../context/auth_context';
import { ROLES } from '../../api/http_client';

const LIMITE_PIEZAS = 20; // HU-007 CA-2: 20 piezas por página

interface Pieza { idPieza: string; codigoInventario: string; nombre: string; estado: string; categoria: { idCategoria: string; nombre: string }; ubicacion: { idUbicacion: string; nombre: string }; fechaIngreso: string; }

export default function PiezasPage() {
  const navigate = useNavigate();
  const { sesion } = useAuth();
  const esAdmin = sesion?.rol === ROLES.ADMINISTRADOR;
  const [datos, setDatos] = useState<Pieza[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [idUbicacion, setIdUbicacion] = useState('');
  const [categorias, setCategorias] = useState<CategoriaOpcion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOpcion[]>([]);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const cargar = async (p: number) => {
    const data = await listPiezas(p, LIMITE_PIEZAS, busqueda || undefined, idCategoria || undefined, idUbicacion || undefined);
    setDatos(data.datos);
    setTotalPaginas(data.totalPaginas);
  };

  useEffect(() => { listCategorias().then(setCategorias); listUbicaciones().then(setUbicaciones); }, []);
  useEffect(() => { cargar(pagina); }, [pagina, busqueda, idCategoria, idUbicacion]);

  const darDeBaja = async () => {
    if (!confirmar) return;
    await deletePieza(confirmar);
    setConfirmar(null);
    setExito(true);
    setTimeout(() => { setExito(false); cargar(pagina); }, 1500);
  };

  return (
    <div>
      {confirmar !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4">
            <img src="/delete.svg" alt="baja" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¿Dar de baja esta pieza?</p>
            <p className="text-sm text-gray-500">El registro permanecerá con estado "Baja".</p>
            <div className="flex gap-3 mt-2">
              <button className="btn-red px-6" onClick={darDeBaja}>Sí, dar de baja</button>
              <button className="btn-gray px-6" onClick={() => setConfirmar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Pieza dada de baja!</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Inventario de Piezas</h2>
        {(esAdmin || sesion?.rol === ROLES.CATALOGADOR) && (
          <button className="btn-blue" onClick={() => navigate('/piezas/crear')}>+ Registrar</button>
        )}
      </div>

      {/* Filtros — HU-007 CA-3 y CA-4 */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input className="input flex-1 min-w-[200px]" placeholder="Buscar por nombre o código..." value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }} />
        <select className="input w-48" value={idCategoria} onChange={(e) => { setIdCategoria(e.target.value); setPagina(1); }}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
        </select>
        <select className="input w-48" value={idUbicacion} onChange={(e) => { setIdUbicacion(e.target.value); setPagina(1); }}>
          <option value="">Todas las ubicaciones</option>
          {ubicaciones.map((u) => <option key={u.idUbicacion} value={u.idUbicacion}>{u.nombre}</option>)}
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="th">Código</th>
              <th className="th">Nombre</th>
              <th className="th">Categoría</th>
              <th className="th">Ubicación</th>
              <th className="th">Estado</th>
              <th className="th">Ingreso</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((p) => (
              <tr key={p.idPieza} className="border-t">
                <td className="td font-mono text-xs">{p.codigoInventario}</td>
                <td className="td">{p.nombre}</td>
                <td className="td">{p.categoria.nombre}</td>
                <td className="td">{p.ubicacion.nombre}</td>
                <td className="td"><span className="text-xs text-gray-700">{p.estado}</span></td>
                <td className="td text-xs">{new Date(p.fechaIngreso).toLocaleDateString('es-EC')}</td>
                <td className="td flex gap-2">
                  {/* Ver QR — HU-007 CA-5 */}
                  <button title="Ver QR" className="bg-gray-500 hover:bg-gray-600 rounded p-1.5 transition-colors text-white text-xs"
                    onClick={() => navigate(`/piezas/${p.idPieza}/qr`)}>
                    Ver
                  </button>
                  {(esAdmin || sesion?.rol === ROLES.CATALOGADOR) && (
                    <button title="Editar" className="bg-blue-600 hover:bg-blue-700 rounded p-1.5 transition-colors"
                      onClick={() => navigate(`/piezas/editar/${p.idPieza}`)}>
                      <img src="/edit.svg" alt="Editar" className="w-4 h-4" />
                    </button>
                  )}
                  {esAdmin && (
                    <button title="Dar de baja" className="bg-red-500 hover:bg-red-600 rounded p-1.5 transition-colors"
                      onClick={() => setConfirmar(p.idPieza)}>
                      <img src="/delete.svg" alt="Baja" className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => setPagina(p)}
            className={`px-3 py-1 rounded text-sm ${p === pagina ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
