// crear/index.tsx — HU-003: crear usuario
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUsuario } from '../../../api/usuarios';
import { listRoles, RolOpcion } from '../../../api/roles';

interface Form { nombres: string; apellidos: string; email: string; password: string; idRol: string; }

const inicial: Form = { nombres: '', apellidos: '', email: '', password: '', idRol: '' };

export default function CrearUsuarioPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(inicial);
  const [roles, setRoles] = useState<RolOpcion[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listRoles().then((data) => {
      setRoles(data);
      if (data.length > 0) setForm((f) => ({ ...f, idRol: data[0].idRol }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUsuario(form);
      navigate('/usuarios');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al crear usuario.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Nuevo Usuario</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="label">Nombres</label><input className="input" required value={form.nombres} onChange={set('nombres')} /></div>
        <div><label className="label">Apellidos</label><input className="input" required value={form.apellidos} onChange={set('apellidos')} /></div>
        <div><label className="label">Correo</label><input className="input" type="email" required value={form.email} onChange={set('email')} /></div>
        <div>
          <label className="label">Contraseña</label>
          <input className="input" type="password" required minLength={8} value={form.password} onChange={set('password')} />
          <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres, una mayúscula y un número.</p>
        </div>
        <div>
          <label className="label">Rol</label>
          <select className="input" value={form.idRol} onChange={set('idRol')}>
            {roles.map((r) => <option key={r.idRol} value={r.idRol}>{r.nombre}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-blue">Guardar</button>
          <button type="button" className="btn-gray" onClick={() => navigate('/usuarios')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
