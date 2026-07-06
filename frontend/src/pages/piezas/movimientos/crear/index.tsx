// piezas/movimientos/crear/index.tsx — HU-014: registrar movimiento de una pieza
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMovimiento } from '../../../../api/piezas';
import { listUbicaciones, UbicacionOpcion } from '../../../../api/ubicaciones';
import { listUsuarios, UsuarioOpcion } from '../../../../api/usuarios';

interface Form {
  tipoMovimiento: string;
  idUbicacionDestino: string;
  fechaSalida: string;
  motivo: string;
  responsable: string;
}

const hoy = new Date().toISOString().split('T')[0];
const inicial: Form = { tipoMovimiento: 'Traslado', idUbicacionDestino: '', fechaSalida: hoy, motivo: '', responsable: '' };

const TIPOS = ['Préstamo', 'Traslado', 'Exposición', 'Restauración', 'Devolución'];

export default function CrearMovimientoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(inicial);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOpcion[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioOpcion[]>([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    listUbicaciones().then(setUbicaciones);
    listUsuarios().then(setUsuarios);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createMovimiento(id!, form);
      setExito(true);
      setTimeout(() => navigate(`/piezas/${id}`), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al registrar movimiento.');
    }
  };

  const set = (field: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Movimiento registrado!</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Registrar Movimiento</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Tipo de movimiento *</label>
          <select className="input" required value={form.tipoMovimiento} onChange={set('tipoMovimiento')}>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Ubicación destino *</label>
          <select className="input" required value={form.idUbicacionDestino} onChange={set('idUbicacionDestino')}>
            <option value="">— Seleccione —</option>
            {ubicaciones.map((u) => (
              <option key={u.idUbicacion} value={u.idUbicacion}>{u.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Fecha de salida *</label>
          <input type="date" className="input" required value={form.fechaSalida} onChange={set('fechaSalida')} />
        </div>

        <div>
          <label className="label">Motivo *</label>
          <textarea className="input" required rows={3} minLength={5} maxLength={500}
            value={form.motivo} onChange={set('motivo')}
            placeholder="Describa el motivo del movimiento" />
        </div>

        <div>
          <label className="label">Responsable *</label>
          <select className="input" required value={form.responsable} onChange={set('responsable')}>
            <option value="">— Seleccione responsable —</option>
            {Array.isArray(usuarios) && usuarios.map((u) => (
              <option key={u.idUsuario} value={`${u.nombres} ${u.apellidos}`}>{u.nombres} {u.apellidos}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-blue">Guardar</button>
          <button type="button" className="btn-gray" onClick={() => navigate(`/piezas/${id}`)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
