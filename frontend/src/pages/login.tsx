// login.tsx — HU-001: inicio de sesión
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth_context';
import { useLoading } from '../context/loading_context';
import { loginRequest } from '../api/auth';

export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setLoading(true);
    setError('');
    try {
      const data = await loginRequest(form.email, form.password);
      iniciarSesion(data.accessToken, data.usuario);
      navigate('/dashboard');
    } catch {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — imagen */}
      <div className="hidden md:flex w-1/2 relative">
        <img src="/login.jpeg" alt="Museo Etnográfico" className="w-full h-full object-cover" fetchPriority="high" width="720" height="1080" />
        <div className="absolute inset-0 bg-[#6B0F0F]/70 flex flex-col items-center justify-center text-white px-10">
          <h1 className="text-3xl font-bold text-center leading-snug">Museo Etnográfico</h1>
          <h2 className="text-2xl font-bold text-center text-red-300 mt-1">"Edgar Palomeque"</h2>
          <p className="mt-3 text-sm text-red-200 text-center">Sistema de Gestión Cultural</p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#6B0F0F] mx-auto mb-4 overflow-hidden">
              <img src="/login.jpeg" alt="logo" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B0F0F]">Iniciar Sesión</h3>
            <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <label htmlFor="email" className="label">Correo electrónico</label>
              <input id="email" className="input" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="password" className="label">Contraseña</label>
              <input id="password" className="input" type="password" required minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button
              className="w-full py-2.5 rounded font-semibold text-white transition-colors bg-[#6B0F0F] hover:bg-red-900"
              type="submit" disabled={cargando}>
              Ingresar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
