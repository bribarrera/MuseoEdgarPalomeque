// pages/piezas/qr/index.tsx — HU: Mostrar solo QR de pieza
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import http from '../../../api/http_client';

export default function PiezaQRPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const piezaRes = await http.get(`/piezas/public/${id}`);
        setCodigo(piezaRes.data.codigoInventario);

        const urlQR = `${window.location.origin}/piezas/public/${id}`;
        const qrCode = new QRCodeStyling({
          width: 300,
          height: 300,
          data: urlQR,
          margin: 10,
          type: 'canvas'
        });

        setTimeout(() => {
          if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrCode.append(qrRef.current);
          }
        }, 100);
      } catch (err) {
        console.error('Error cargando QR:', err);
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
      data: `${window.location.origin}/piezas/public/${id}`,
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
    qrCode.download({ name: `qr-${codigo}`, extension: 'png' });
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Código QR</h2>
        <p className="text-gray-500 mb-6">{codigo}</p>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-300 inline-block mb-6" ref={qrRef} />

        <p className="text-sm text-gray-600 mb-6">
          Escanea con tu celular para ver toda la información de la pieza
        </p>

        <div className="flex gap-3">
          <button onClick={descargarQR} className="btn-blue flex-1">
            Descargar QR
          </button>
          <button onClick={() => navigate('/piezas')} className="btn-gray flex-1">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
