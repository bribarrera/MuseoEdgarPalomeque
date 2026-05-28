// piezas/detalle/index.tsx — HU-008: ver detalle completo de una pieza
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readPieza } from '../../../api/piezas';
import { useAuth } from '../../../context/auth_context';
import { ROLES } from '../../../api/http_client';

interface Pieza {
  idPieza: string; codigoInventario: string; nombre: string; descripcion: string;
  origen: string; dimensiones: string; anioAproximado?: string;
  estado: string; estadoConservacion: string;
  categoria: { nombre: string }; ubicacion: { nombre: string };
  fechaIngreso: string; imagenes?: string[];
}

export default function DetallePiezaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sesion } = useAuth();
  const puedeEditar = sesion?.rol === ROLES.ADMINISTRADOR || sesion?.rol === ROLES.CATALOGADOR;
  const [pieza, setPieza] = useState<Pieza | null>(null);
  const [imgActiva, setImgActiva] = useState(0);

  useEffect(() => { readPieza(id!).then(setPieza); }, [id]);

  if (!pieza) return <p className="text-gray-500 text-sm">Cargando...</p>;

  const imagenes = pieza.imagenes ?? [];

  const campo = (label: string, valor?: string) => (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800">{valor ?? '—'}</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{pieza.nombre}</h2>
          <p className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded w-fit mt-1">{pieza.codigoInventario}</p>
        </div>
        <div className="flex gap-2">
          {puedeEditar && (
            <button className="btn-blue" onClick={() => navigate(`/piezas/editar/${pieza.idPieza}`)}>
              Editar
            </button>
          )}
          <button className="btn-gray" onClick={() => navigate('/piezas')}>Volver</button>
        </div>
      </div>

      {/* Galería de imágenes */}
      {imagenes.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
          {/* Imagen principal */}
          <div className="flex items-center justify-center" style={{ minHeight: '18rem' }}>
            <img
              src={imagenes[imgActiva]}
              alt={`${pieza.nombre} — foto ${imgActiva + 1}`}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          {/* Miniaturas cuando hay más de una imagen */}
          {imagenes.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-gray-100">
              {imagenes.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgActiva(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                    i === imgActiva ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt={`miniatura ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <span className="flex-shrink-0 self-center text-xs text-gray-400 ml-1">
                {imgActiva + 1} / {imagenes.length}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Datos principales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 grid grid-cols-2 gap-4">
        {campo('Categoría', pieza.categoria.nombre)}
        {campo('Ubicación actual', pieza.ubicacion.nombre)}
        {campo('Origen / Procedencia', pieza.origen)}
        {campo('Dimensiones', pieza.dimensiones)}
        {campo('Año aproximado', pieza.anioAproximado)}
        {campo('Fecha de ingreso', new Date(pieza.fechaIngreso).toLocaleDateString('es-EC'))}
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Descripción</p>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{pieza.descripcion}</p>
      </div>

      {/* Estado de conservación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-8">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Estado de la pieza</p>
          <span className="text-sm font-semibold text-gray-800">{pieza.estado}</span>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Estado de conservación</p>
          <span className={`text-sm font-semibold ${
            pieza.estadoConservacion === 'Bueno' ? 'text-green-600' :
            pieza.estadoConservacion === 'Regular' ? 'text-yellow-600' : 'text-red-600'
          }`}>{pieza.estadoConservacion}</span>
        </div>
      </div>

      {/* Acciones de conservación (Sprint 3) */}
      {puedeEditar && (
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-blue" onClick={() => navigate(`/piezas/${pieza.idPieza}/conservacion/crear`)}>
            + Registrar estado
          </button>
          <button className="btn-gray" onClick={() => navigate(`/piezas/${pieza.idPieza}/conservacion/historial`)}>
            Ver historial
          </button>
        </div>
      )}

      {/* Acciones de movimiento (Sprint 4) */}
      {puedeEditar && (
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-blue" onClick={() => navigate(`/piezas/${pieza.idPieza}/movimientos/crear`)}>
            + Registrar movimiento
          </button>
          <button className="btn-gray" onClick={() => navigate(`/piezas/${pieza.idPieza}/movimientos/historial`)}>
            Ver trazabilidad
          </button>
        </div>
      )}
    </div>
  );
}
