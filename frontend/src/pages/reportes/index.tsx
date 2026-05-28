// reportes/index.tsx — reporte inventario PDF (HU-021) y conservación PDF (HU-022)
import { useState } from 'react';
import { descargarReporteInventario, descargarReporteConservacion } from '../../api/piezas';

const NIVELES = ['Excelente', 'Bueno', 'Regular', 'Malo'];

function descargar(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function leerErrorBlob(err: unknown): Promise<string> {
  const e = err as any;
  if (e?.response?.data instanceof Blob) {
    try {
      const texto = await (e.response.data as Blob).text();
      const json = JSON.parse(texto);
      return json.message ?? texto;
    } catch {
      return 'Error del servidor al generar el reporte.';
    }
  }
  return 'No se pudo generar el reporte. Intente nuevamente.';
}

export default function ReportesPage() {
  const [cargandoInv, setCargandoInv]   = useState(false);
  const [cargandoCon, setCargandoCon]   = useState(false);
  const [nivelCon,    setNivelCon]      = useState('');
  const [errorInv,    setErrorInv]      = useState('');
  const [errorCon,    setErrorCon]      = useState('');

  const handleInventario = async () => {
    setErrorInv('');
    setCargandoInv(true);
    try {
      const blob = await descargarReporteInventario();
      descargar(blob, `inventario_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      setErrorInv(await leerErrorBlob(err));
    } finally {
      setCargandoInv(false);
    }
  };

  const handleConservacion = async () => {
    setErrorCon('');
    setCargandoCon(true);
    try {
      const blob = await descargarReporteConservacion(nivelCon || undefined);
      const sufijo = nivelCon ? `_${nivelCon.toLowerCase()}` : '_todos';
      descargar(blob, `conservacion${sufijo}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      setErrorCon(await leerErrorBlob(err));
    } finally {
      setCargandoCon(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reportes del Sistema</h2>

      <div className="space-y-4">

        {/* Inventario completo */}
        <div className="bg-white rounded shadow border-t-2 border-[#6B0F0F] p-4">
          <p className="font-semibold text-gray-800 mb-1">Inventario completo</p>
          <p className="text-sm text-gray-500 mb-4">
            Todas las piezas activas con código, categoría, ubicación y estado de conservación.
          </p>
          {errorInv && <p className="text-red-500 text-sm mb-3">{errorInv}</p>}
          <button className="btn-blue" onClick={handleInventario} disabled={cargandoInv}>
            {cargandoInv ? 'Generando...' : 'Descargar (.pdf)'}
          </button>
        </div>

        {/* Estado de conservación */}
        <div className="bg-white rounded shadow border-t-2 border-[#6B0F0F] p-4">
          <p className="font-semibold text-gray-800 mb-1">Estado de conservación</p>
          <p className="text-sm text-gray-500 mb-3">
            Piezas agrupadas por nivel. Puede filtrar por un nivel específico.
          </p>
          <div className="mb-3">
            <label className="label">Nivel</label>
            <select className="input" value={nivelCon} onChange={(e) => setNivelCon(e.target.value)}>
              <option value="">Todos los niveles</option>
              {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {errorCon && <p className="text-red-500 text-sm mb-3">{errorCon}</p>}
          <button className="btn-blue" onClick={handleConservacion} disabled={cargandoCon}>
            {cargandoCon ? 'Generando...' : 'Descargar (.pdf)'}
          </button>
        </div>

      </div>
    </div>
  );
}
