// pages/auditoria/index.tsx — HU-023: registro de auditoría (solo Administrador)
import { useEffect, useState } from 'react';
import { listAuditorias } from '../../api/auditorias';

interface Registro {
  _id: string;
  nombreUsuario: string;
  entidad: string;
  accion: string;
  idRegistro?: string;
  fechaEvento: string;
}

const ETIQUETA_ENTIDAD: Record<string, string> = {
  pieza:      'Pieza',
  usuario:    'Usuario',
  categoria:  'Categoría',
  ubicacion:  'Ubicación',
  movimiento: 'Movimiento',
};

const ETIQUETA_ACCION: Record<string, { label: string }> = {
  LOGIN:   { label: 'Ingreso al sistema' },
  LOGOUT:  { label: 'Cierre de sesión' },
  CREATE:  { label: 'Registro' },
  UPDATE:  { label: 'Modificación' },
  DELETE:  { label: 'Baja' },
};

const LIMITE = 20;

export default function AuditoriaPage() {
  const [datos, setDatos] = useState<Registro[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [entidad, setEntidad] = useState('');
  const [accion, setAccion] = useState('');

  const cargar = async (p: number) => {
    const data = await listAuditorias(
      p, LIMITE,
      desde || undefined,
      hasta || undefined,
      entidad || undefined,
      accion || undefined,
    );
    setDatos(data.datos);
    setTotalPaginas(data.totalPaginas);
  };

  useEffect(() => { cargar(pagina); }, [pagina, desde, hasta, entidad, accion]);

  const limpiar = () => {
    setDesde(''); setHasta(''); setEntidad(''); setAccion(''); setPagina(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Registro de Auditoría</h2>
      </div>

      {/* Filtros — T-054 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <label className="label">Desde</label>
            <input type="date" className="input" value={desde} onChange={(e) => { setDesde(e.target.value); setPagina(1); }} />
          </div>
          <div>
            <label className="label">Hasta</label>
            <input type="date" className="input" value={hasta} onChange={(e) => { setHasta(e.target.value); setPagina(1); }} />
          </div>
          <div>
            <label className="label">Módulo</label>
            <select className="input" value={entidad} onChange={(e) => { setEntidad(e.target.value); setPagina(1); }}>
              <option value="">Todos los módulos</option>
              {Object.entries(ETIQUETA_ENTIDAD).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Tipo de acción</label>
            <select className="input" value={accion} onChange={(e) => { setAccion(e.target.value); setPagina(1); }}>
              <option value="">Todas las acciones</option>
              {Object.entries(ETIQUETA_ACCION).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        {(desde || hasta || entidad || accion) && (
          <button onClick={limpiar} className="mt-3 text-sm text-blue-600 hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla — T-054 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="th">Fecha y hora</th>
              <th className="th">Usuario</th>
              <th className="th">Módulo</th>
              <th className="th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 && (
              <tr><td colSpan={4} className="td text-center text-gray-400 py-8">Sin registros para los filtros seleccionados</td></tr>
            )}
            {datos.map((r) => {
              const accionInfo = ETIQUETA_ACCION[r.accion] ?? { label: r.accion, color: 'bg-gray-100 text-gray-600' };
              return (
                <tr key={r._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="td text-xs font-mono text-gray-600 whitespace-nowrap">
                    {new Date(r.fechaEvento).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="td text-sm">{r.nombreUsuario}</td>
                  <td className="td text-sm">{ETIQUETA_ENTIDAD[r.entidad] ?? r.entidad}</td>
                  <td className="td text-sm">{accionInfo.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPagina(p)}
              className={`px-3 py-1 rounded text-sm ${p === pagina ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
