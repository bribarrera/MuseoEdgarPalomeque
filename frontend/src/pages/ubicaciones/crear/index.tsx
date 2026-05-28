// ubicaciones/crear/index.tsx — HU-007: crear ubicación
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUbicacion } from '../../../api/ubicaciones';

interface Form { nombre: string; descripcion: string; }
const inicial: Form = { nombre: '', descripcion: '' };

export default function CrearUbicacionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(inicial);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUbicacion(form);
      navigate('/ubicaciones');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al crear ubicación.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Nueva Ubicación</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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
