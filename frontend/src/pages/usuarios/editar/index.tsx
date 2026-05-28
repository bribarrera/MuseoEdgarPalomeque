// editar/index.tsx — HU-005: modificar usuario
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readUsuario, updateUsuario } from '../../../api/usuarios';
import { listRoles, RolOpcion } from '../../../api/roles';

interface Usuario { idUsuario: string; nombres: string; apellidos: string; email: string; rol: { idRol: string; nombre: string }; estado: boolean; }
interface Form { nombres?: string; apellidos?: string; email?: string; idRol?: string; estado?: boolean; }

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({});
  const [roles, setRoles] = useState<RolOpcion[]>([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    readUsuario(id!).then((data: Usuario) => {
      setForm({ nombres: data.nombres, apellidos: data.apellidos, email: data.email, idRol: data.rol.idRol, estado: data.estado });
    });
    listRoles().then(setRoles);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateUsuario(id!, form);
      setExito(true);
      setTimeout(() => navigate('/usuarios'), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al actualizar.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Usuario actualizado!</p>
            <p className="text-sm text-gray-500">Redirigiendo al listado...</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="label">Nombres</label><input className="input" required value={form.nombres ?? ''} onChange={set('nombres')} /></div>
        <div><label className="label">Apellidos</label><input className="input" required value={form.apellidos ?? ''} onChange={set('apellidos')} /></div>
        <div><label className="label">Correo</label><input className="input" type="email" required value={form.email ?? ''} onChange={set('email')} /></div>
        <div>
          <label className="label">Rol</label>
          <select className="input" value={form.idRol ?? ''} onChange={set('idRol')}>
            {roles.map((r) => <option key={r.idRol} value={r.idRol}>{r.nombre}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="estado" checked={form.estado ?? false}
            onChange={(e) => setForm({ ...form, estado: e.target.checked })} />
          <label htmlFor="estado" className="text-sm">Activo</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-blue flex items-center gap-2">
            <img src="/save.svg" alt="" className="w-4 h-4" />Guardar
          </button>
          <button type="button" className="btn-gray flex items-center gap-2" onClick={() => navigate('/usuarios')}>
            <img src="/cancel.svg" alt="" className="w-4 h-4" />Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
