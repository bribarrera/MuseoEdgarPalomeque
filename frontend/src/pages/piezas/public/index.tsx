// pages/piezas/public/index.tsx — HU: Vista pública de pieza con QR
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import http from '../../../api/http_client';

interface Pieza {
  idPieza: string;
  codigoInventario: string;
  nombre: string;
  descripcion: string;
  origen: string;
  dimensiones: string;
  anioAproximado?: string;
  estado: string;
  estadoConservacion: string;
  imagenes: string[];
}

export default function PiezaPublicPage() {
  const { id } = useParams();
  const qrRef = useRef<HTMLDivElement>(null);
  const [pieza, setPieza] = useState<Pieza | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgActiva, setImgActiva] = useState(0);

  useEffect(() => {
    const cargar = async () => {
      try {
        const piezaRes = await http.get(`/piezas/public/${id}`);
        setPieza(piezaRes.data);

        const urlQR = window.location.href;
        const qrCode = new QRCodeStyling({
          width: 200,
          height: 200,
          data: urlQR,
          margin: 10,
          type: 'canvas',
          dotsOptions: {
            color: '#000000',
            type: 'square'
          },
          cornersSquareOptions: {
            color: '#000000',
            type: 'square'
          }
        });

        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrCode.append(qrRef.current);
        }
      } catch (err) {
        setError('Error al cargar pieza');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  const descargarQR = () => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: window.location.href,
      margin: 10,
      type: 'svg',
    });
    qrCode.download({ name: `qr-${pieza?.codigoInventario}`, extension: 'png' });
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error || !pieza) return <div className="p-6 text-red-500">{error || 'Pieza no encontrada'}</div>;

  const imagenes = pieza.imagenes ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{pieza.nombre}</h1>

      {/* Galería de imágenes */}
      {imagenes.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
          <div className="flex items-center justify-center" style={{ minHeight: '20rem' }}>
            <img
              src={imagenes[imgActiva]}
              alt={`${pieza.nombre} — foto ${imgActiva + 1}`}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          {imagenes.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-gray-300">
              {imagenes.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgActiva(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                    i === imgActiva ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt={`miniatura ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <span className="flex-shrink-0 self-center text-xs text-gray-500 ml-1">
                {imgActiva + 1} / {imagenes.length}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Información */}
        <div className="bg-white rounded-lg border border-gray-300 p-4 space-y-3 text-sm">
          <p><strong>Código:</strong> {pieza.codigoInventario}</p>
          <p><strong>Origen:</strong> {pieza.origen}</p>
          <p><strong>Dimensiones:</strong> {pieza.dimensiones}</p>
          {pieza.anioAproximado && <p><strong>Año:</strong> {pieza.anioAproximado}</p>}
          <p><strong>Estado:</strong> {pieza.estado}</p>
          <p><strong>Conservación:</strong> {pieza.estadoConservacion}</p>
          <p><strong>Descripción:</strong> {pieza.descripcion}</p>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <div ref={qrRef} />
          </div>
          <button onClick={descargarQR} className="btn-blue w-full">
            Descargar QR
          </button>
        </div>
      </div>
    </div>
  );
}
