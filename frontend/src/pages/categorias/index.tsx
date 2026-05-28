// categorias/index.tsx — HU-006: gestionar categorías
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCategorias, CategoriaOpcion } from '../../api/categorias';

export default function CategoriasPage() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<CategoriaOpcion[]>([]);

  useEffect(() => { listCategorias().then(setDatos); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Categorías</h2>
        <button className="btn-blue" onClick={() => navigate('/categorias/crear')}>+ Nueva</button>
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
            {datos.map((c) => (
              <tr key={c.idCategoria} className="border-t">
                <td className="td">{c.nombre}</td>
                <td className="td">{c.descripcion ?? '—'}</td>
                <td className="td">
                  <button title="Editar" className="bg-blue-600 hover:bg-blue-700 rounded p-1.5 transition-colors"
                    onClick={() => navigate(`/categorias/editar/${c.idCategoria}`)}>
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
