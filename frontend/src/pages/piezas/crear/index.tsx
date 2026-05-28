// piezas/crear/index.tsx — HU-006: registrar nueva pieza patrimonial
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPieza } from '../../../api/piezas';
import { listCategorias, CategoriaOpcion } from '../../../api/categorias';
import { listUbicaciones, UbicacionOpcion } from '../../../api/ubicaciones';

interface Form { codigoInventario: string; nombre: string; descripcion: string; origen: string; dimensiones: string; anioAproximado: string; estadoConservacion: string; idCategoria: string; idUbicacion: string; }
const inicial: Form = { codigoInventario: '', nombre: '', descripcion: '', origen: '', dimensiones: '', anioAproximado: '', estadoConservacion: 'Bueno', idCategoria: '', idUbicacion: '' };

export default function CrearPiezaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(inicial);
  const [categorias, setCategorias] = useState<CategoriaOpcion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOpcion[]>([]);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [codigoGuardado, setCodigoGuardado] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listCategorias().then((d) => { setCategorias(d); if (d.length) setForm((f) => ({ ...f, idCategoria: d[0].idCategoria })); });
    listUbicaciones().then((d) => { setUbicaciones(d); if (d.length) setForm((f) => ({ ...f, idUbicacion: d[0].idUbicacion })); });
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seleccionadas = Array.from(e.target.files ?? []);
    setImagenes((prev) => [...prev, ...seleccionadas]);
    const urls = seleccionadas.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const quitarImagen = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setImagenes((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      imagenes.forEach((img) => fd.append('imagenes', img));
      const resultado = await createPieza(fd);
      setCodigoGuardado(resultado.codigoInventario ?? form.codigoInventario);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al registrar pieza.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      {/* Modal confirmación con código asignado — HU-006 CA-5 */}
      {codigoGuardado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Pieza registrada!</p>
            <p className="text-sm text-gray-500">Código asignado:</p>
            <p className="text-xl font-mono font-bold text-blue-700">{codigoGuardado}</p>
            <button className="btn-blue mt-2" onClick={() => navigate('/piezas')}>Ir al inventario</button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Registrar Pieza</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="label">Código de Inventario *</label><input className="input" required maxLength={50} value={form.codigoInventario} onChange={set('codigoInventario')} /></div>
        <div><label className="label">Nombre *</label><input className="input" required maxLength={200} value={form.nombre} onChange={set('nombre')} /></div>
        <div><label className="label">Descripción *</label>
          <textarea className="input" required rows={3} maxLength={1000} value={form.descripcion} onChange={set('descripcion')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Origen *</label><input className="input" required maxLength={200} value={form.origen} onChange={set('origen')} /></div>
          <div><label className="label">Dimensiones *</label><input className="input" required maxLength={200} placeholder="ej. 30cm x 20cm" value={form.dimensiones} onChange={set('dimensiones')} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Año aprox.</label><input className="input" maxLength={20} value={form.anioAproximado} onChange={set('anioAproximado')} /></div>
          <div>
            <label className="label">Estado de conservación</label>
            <select className="input" value={form.estadoConservacion} onChange={set('estadoConservacion')}>
              {['Bueno', 'Regular', 'Malo', 'Restaurado'].map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Categoría *</label>
            <select className="input" required value={form.idCategoria} onChange={set('idCategoria')}>
              {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Ubicación *</label>
            <select className="input" required value={form.idUbicacion} onChange={set('idUbicacion')}>
              {ubicaciones.map((u) => <option key={u.idUbicacion} value={u.idUbicacion}>{u.nombre}</option>)}
            </select>
          </div>
        </div>

        {/* Fotografías múltiples */}
        <div>
          <label className="label">Fotografías <span className="text-gray-400">(opcional, puede seleccionar varias)</span></label>
          <input ref={fileRef} type="file" accept="image/*" multiple className="input" onChange={handleFiles} />
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt={`imagen ${i + 1}`} className="w-full h-24 object-cover rounded border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => quitarImagen(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-blue">Guardar</button>
          <button type="button" className="btn-gray" onClick={() => navigate('/piezas')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
