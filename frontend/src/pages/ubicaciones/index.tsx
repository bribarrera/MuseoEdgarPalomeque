// ubicaciones/index.tsx — HU-007: gestionar ubicaciones
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUbicaciones, UbicacionOpcion } from '../../api/ubicaciones';

export default function UbicacionesPage() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<UbicacionOpcion[]>([]);

  useEffect(() => { listUbicaciones().then(setDatos); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ubicaciones</h2>
        <button className="btn-blue" onClick={() => navigate('/ubicaciones/crear')}>+ Nueva</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="th">Nombre</th>
              <th className="th">Descripción</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((u) => (
              <tr key={u.idUbicacion} className="border-t">
                <td className="td">{u.nombre}</td>
                <td className="td">{u.descripcion ?? '—'}</td>
                <td className="td">
                  <button title="Editar" className="bg-blue-600 hover:bg-blue-700 rounded p-1.5 transition-colors"
                    onClick={() => navigate(`/ubicaciones/editar/${u.idUbicacion}`)}>
                    <img src="/edit.svg" alt="Editar" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
