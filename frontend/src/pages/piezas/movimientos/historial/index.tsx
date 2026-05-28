// piezas/movimientos/historial/index.tsx — HU-015: trazabilidad completa de una pieza
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHistorialMovimientos } from '../../../../api/piezas';

interface Movimiento {
  _id: string;
  tipoMovimiento: string;
  ubicacionOrigen: { nombre: string };
  ubicacionDestino: { nombre: string };
  fechaSalida: string;
  motivo: string;
  responsable: string;
  registradoPor: { nombres: string; apellidos: string };
}

export default function HistorialMovimientosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getHistorialMovimientos(id!).then((data) => {
      setMovimientos(data);
      setCargando(false);
    });
  }, [id]);

  if (cargando) return <p className="text-gray-500 text-sm">Cargando trazabilidad...</p>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Trazabilidad de la Pieza</h2>
        <button className="btn-gray" onClick={() => navigate(`/piezas/${id}`)}>Volver</button>
      </div>

      {movimientos.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">Sin movimientos registrados</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Origen</th>
                <th className="px-4 py-3 text-left">Destino</th>
                <th className="px-4 py-3 text-left">Motivo</th>
                <th className="px-4 py-3 text-left">Responsable</th>
                <th className="px-4 py-3 text-left">Registrado por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movimientos.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(m.fechaSalida).toLocaleDateString('es-EC')}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{m.tipoMovimiento}</td>
                  <td className="px-4 py-3 text-gray-600">{m.ubicacionOrigen.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{m.ubicacionDestino.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{m.motivo}</td>
                  <td className="px-4 py-3 text-gray-600">{m.responsable}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {m.registradoPor.nombres} {m.registradoPor.apellidos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
