// ubicaciones/editar/index.tsx — HU-007: editar ubicación
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listUbicaciones, updateUbicacion, UbicacionOpcion } from '../../../api/ubicaciones';

interface Form { nombre: string; descripcion: string; }

export default function EditarUbicacionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    listUbicaciones().then((data: UbicacionOpcion[]) => {
      const u = data.find((x) => x.idUbicacion === id);
      if (u) setForm({ nombre: u.nombre, descripcion: u.descripcion ?? '' });
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateUbicacion(id!, form);
      setExito(true);
      setTimeout(() => navigate('/ubicaciones'), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al actualizar.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Ubicación</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Ubicación actualizada!</p>
            <p className="text-sm text-gray-500">Redirigiendo al listado...</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="label">Nombre</label><input className="input" required maxLength={100} value={form.nombre} onChange={set('nombre')} /></div>
        <div><label className="label">Descripción <span className="text-gray-400">(opcional)</span></label>
          <textarea className="input" rows={3} maxLength={255} value={form.descripcion} onChange={set('descripcion')} /></div>
        <div className="flex gap-3">
          <button type="submit" className="btn-blue">Guardar</button>
          <button type="button" className="btn-gray" onClick={() => navigate('/ubicaciones')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
