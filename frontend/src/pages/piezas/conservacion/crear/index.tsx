import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createConservacion } from '../../../../api/piezas';

interface Form { nivel: string; descripcion: string; }
const inicial: Form = { nivel: 'Bueno', descripcion: '' };

export default function CrearConservacionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(inicial);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createConservacion(id!, form);
      setExito(true);
      setTimeout(() => navigate(`/piezas/${id}`), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al registrar estado.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Estado registrado!</p>
          </div>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">Registrar Estado de Conservación</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nivel de estado *</label>
          <select className="input" required value={form.nivel} onChange={set('nivel')}>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </div>
        <div>
          <label className="label">Observaciones *</label>
          <textarea className="input" required rows={4} maxLength={500} value={form.descripcion} onChange={set('descripcion')} />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-blue">Guardar</button>
          <button type="button" className="btn-gray" onClick={() => navigate(`/piezas/${id}`)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
