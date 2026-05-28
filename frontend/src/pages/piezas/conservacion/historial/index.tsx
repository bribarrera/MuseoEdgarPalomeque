import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHistorialConservacion } from '../../../../api/piezas';

interface Registro {
  _id: string;
  nivel: string;
  descripcion: string;
  fechaRegistro: string;
  createdAt: string;
  registradoPor: { nombres: string; apellidos: string };
}

export default function HistorialConservacionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getHistorialConservacion(id!).then((data) => {
      setRegistros(data);
      setCargando(false);
    });
  }, [id]);

  if (cargando) return <p className="text-gray-500 text-sm">Cargando historial...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Historial de Conservación</h2>
        <button className="btn-gray" onClick={() => navigate(`/piezas/${id}`)}>Volver</button>
      </div>

      <div className="space-y-3">
        {registros.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Sin registros de conservación</p>
        ) : (
          registros.map((r) => (
            <div key={r._id} className="bg-white rounded shadow p-4 border-l-4" style={{
              borderLeftColor: r.nivel === 'Excelente' ? '#10b981' : r.nivel === 'Bueno' ? '#3b82f6' : r.nivel === 'Regular' ? '#f59e0b' : '#ef4444'
            }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{r.nivel}</p>
                  <p className="text-xs text-gray-500">{new Date(r.fechaRegistro ?? r.createdAt).toLocaleDateString('es-EC')} · {new Date(r.fechaRegistro ?? r.createdAt).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <p className="text-xs text-gray-600">{r.registradoPor.nombres} {r.registradoPor.apellidos}</p>
              </div>
              <p className="text-sm text-gray-700 mt-2">{r.descripcion}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
