// usuarios/index.tsx — HU-004: listar usuarios con paginación
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUsuarios } from '../../api/usuarios';
import { deleteUsuario } from '../../api/usuarios';
import { LIMITE_PAGINA } from '../../api/http_client';

interface Usuario { idUsuario: string; nombres: string; apellidos: string; email: string; rol: { idRol: string; nombre: string }; estado: boolean; }
interface PaginadoUsuarios { datos: Usuario[]; totalPaginas: number; }

export default function UsuariosPage() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const cargar = async (p: number) => {
    const data = await listUsuarios(p, LIMITE_PAGINA);
    setDatos(data.datos);
    setTotal(data.totalPaginas);
  };

  useEffect(() => { cargar(pagina); }, [pagina]);

  const desactivar = async () => {
    if (confirmar === null) return;
    await deleteUsuario(confirmar);
    setConfirmar(null);
    setExito(true);
    setTimeout(() => { setExito(false); cargar(pagina); }, 1500);
  };

  return (
    <div>
      {/* Modal confirmación */}
      {confirmar !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4">
            <img src="/delete.svg" alt="eliminar" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¿Desactivar este usuario?</p>
            <p className="text-sm text-gray-500">Esta acción cambiará el estado a inactivo.</p>
            <div className="flex gap-3 mt-2">
              <button className="btn-red px-6" onClick={desactivar}>Sí, desactivar</button>
              <button className="btn-gray px-6" onClick={() => setConfirmar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal éxito */}
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Usuario desactivado!</p>
            <p className="text-sm text-gray-500">El usuario ha sido desactivado correctamente.</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <button className="btn-blue" onClick={() => navigate('/usuarios/crear')}>+ Nuevo</button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="th">Nombres</th>
              <th className="th">Apellidos</th>
              <th className="th">Correo</th>
              <th className="th">Rol</th>
              <th className="th">Estado</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((u) => (
              <tr key={u.idUsuario} className="border-t">
                <td className="td">{u.nombres}</td>
                <td className="td">{u.apellidos}</td>
                <td className="td">{u.email}</td>
                <td className="td">{u.rol.nombre}</td>
                <td className="td">
                  <span className="text-xs text-gray-700">
                    {u.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="td flex gap-2">
                  <button title="Editar" className="bg-blue-600 hover:bg-blue-700 rounded p-1.5 transition-colors" onClick={() => navigate(`/usuarios/editar/${u.idUsuario}`)}>
                    <img src="/edit.svg" alt="Editar" className="w-4 h-4" />
                  </button>
                  <button title="Desactivar" className="bg-red-500 hover:bg-red-600 rounded p-1.5 transition-colors" onClick={() => setConfirmar(u.idUsuario)}>
                    <img src="/delete.svg" alt="Desactivar" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => setPagina(p)}
            className={`px-3 py-1 rounded text-sm ${p === pagina ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
