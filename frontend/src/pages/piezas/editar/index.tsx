// piezas/editar/index.tsx — HU-009: modificar pieza (código NO editable)
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readPieza, updatePieza } from '../../../api/piezas';
import { listCategorias, CategoriaOpcion } from '../../../api/categorias';
import { listUbicaciones, UbicacionOpcion } from '../../../api/ubicaciones';

// codigoInventario excluido del formulario — HU-009 CA-2: el código no es modificable
interface Form { nombre: string; descripcion: string; origen: string; dimensiones: string; anioAproximado: string; estadoConservacion: string; idCategoria: string; idUbicacion: string; }

export default function EditarPiezaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [codigoActual, setCodigoActual] = useState('');
  const [form, setForm] = useState<Form>({ nombre: '', descripcion: '', origen: '', dimensiones: '', anioAproximado: '', estadoConservacion: 'Bueno', idCategoria: '', idUbicacion: '' });
  const [categorias, setCategorias] = useState<CategoriaOpcion[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOpcion[]>([]);
  const [imagenesActuales, setImagenesActuales] = useState<string[]>([]);
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
  const [nuevasPreviews, setNuevasPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    readPieza(id!).then((p: any) => {
      setCodigoActual(p.codigoInventario);
      setImagenesActuales(p.imagenes ?? []);
      setForm({
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        origen: p.origen ?? '',
        dimensiones: p.dimensiones ?? '',
        anioAproximado: p.anioAproximado ?? '',
        estadoConservacion: p.estadoConservacion ?? 'Bueno',
        idCategoria: p.categoria?.idCategoria ?? p.categoria?._id ?? '',
        idUbicacion: p.ubicacion?.idUbicacion ?? p.ubicacion?._id ?? '',
      });
    });
    listCategorias().then(setCategorias);
    listUbicaciones().then(setUbicaciones);
  }, [id]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seleccionadas = Array.from(e.target.files ?? []);
    setNuevasImagenes((prev) => [...prev, ...seleccionadas]);
    const urls = seleccionadas.map((f) => URL.createObjectURL(f));
    setNuevasPreviews((prev) => [...prev, ...urls]);
  };

  const quitarNueva = (idx: number) => {
    URL.revokeObjectURL(nuevasPreviews[idx]);
    setNuevasImagenes((prev) => prev.filter((_, i) => i !== idx));
    setNuevasPreviews((prev) => prev.filter((_, i) => i !== idx));
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      nuevasImagenes.forEach((img) => fd.append('imagenes', img));
      await updatePieza(id!, fd);
      setExito(true);
      setTimeout(() => navigate('/piezas'), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al actualizar.');
    }
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Pieza</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3">
            <img src="/save.svg" alt="éxito" className="w-16 h-16" />
            <p className="text-lg font-semibold text-gray-800">¡Pieza actualizada!</p>
            <p className="text-sm text-gray-500">Redirigiendo al inventario...</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Código solo lectura — no modificable */}
        <div>
          <label className="label">Código de Inventario</label>
          <p className="input bg-gray-100 cursor-not-allowed text-gray-600 font-mono">{codigoActual}</p>
        </div>
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
            <label className="label">Categoría</label>
            <select className="input" value={form.idCategoria} onChange={set('idCategoria')}>
              {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Ubicación</label>
            <select className="input" value={form.idUbicacion} onChange={set('idUbicacion')}>
              {ubicaciones.map((u) => <option key={u.idUbicacion} value={u.idUbicacion}>{u.nombre}</option>)}
            </select>
          </div>
        </div>

        {/* Imágenes actuales de la pieza */}
        {imagenesActuales.length > 0 && (
          <div>
            <label className="label">Fotografías actuales ({imagenesActuales.length})</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {imagenesActuales.map((src, i) => (
                <img key={i} src={src} alt={`foto ${i + 1}`} className="w-full h-24 object-cover rounded border border-gray-200" />
              ))}
            </div>
          </div>
        )}

        {/* Agregar nuevas fotografías */}
        <div>
          <label className="label">Agregar fotografías <span className="text-gray-400">(opcional, se añaden a las existentes)</span></label>
          <input ref={fileRef} type="file" accept="image/*" multiple className="input" onChange={handleFiles} />
          {nuevasPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {nuevasPreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt={`nueva ${i + 1}`} className="w-full h-24 object-cover rounded border border-blue-300" />
                  <button
                    type="button"
                    onClick={() => quitarNueva(i)}
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
