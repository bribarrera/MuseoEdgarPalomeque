// pages/piezas/public/index.tsx — HU: Vista pública de pieza con QR
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [pieza, setPieza] = useState<Pieza | null>(null);
  const [qr, setQr] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [piezaRes, qrRes] = await Promise.all([
          http.get(`/piezas/public/${id}`),
          http.get(`/piezas/public/${id}/qr`),
        ]);
        setPieza(piezaRes.data);
        setQr(qrRes.data.qr);
      } catch (err) {
        setError('Error al cargar pieza');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  const descargarQR = () => {
    const link = document.createElement('a');
    link.href = qr;
    link.download = `qr-${pieza?.codigoInventario}.png`;
    link.click();
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error || !pieza) return <div className="p-6 text-red-500">{error || 'Pieza no encontrada'}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Información */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{pieza.nombre}</h1>
          <div className="space-y-3 text-sm">
            <p><strong>Código:</strong> {pieza.codigoInventario}</p>
            <p><strong>Descripción:</strong> {pieza.descripcion}</p>
            <p><strong>Origen:</strong> {pieza.origen}</p>
            <p><strong>Dimensiones:</strong> {pieza.dimensiones}</p>
            {pieza.anioAproximado && <p><strong>Año:</strong> {pieza.anioAproximado}</p>}
            <p><strong>Estado:</strong> {pieza.estado}</p>
            <p><strong>Conservación:</strong> {pieza.estadoConservacion}</p>
          </div>
        </div>

        {/* QR y Imagen */}
        <div className="flex flex-col items-center gap-4">
          {pieza.imagenes?.[0] && (
            <img src={pieza.imagenes[0]} alt={pieza.nombre} className="w-full h-64 object-cover rounded-lg" />
          )}
          {qr && (
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <img src={qr} alt="QR Code" className="w-48 h-48" />
              <button onClick={descargarQR} className="btn-blue mt-3 w-full">
                Descargar QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
