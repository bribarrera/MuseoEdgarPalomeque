// context/auth_context.tsx — estado global de sesión (HU-001, HU-002)
import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Administrador' | 'Catalogador' | 'Consultor';

export type Sesion = {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  rol: UserRole;
};

type AuthContextType = {
  sesion: Sesion | null;
  iniciarSesion: (token: string, usuario: Sesion) => void;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() => {
    const saved = localStorage.getItem('sesion');
    return saved ? JSON.parse(saved) : null;
  });

  const iniciarSesion = (token: string, usuario: Sesion) => {
    localStorage.setItem('token', token);
    localStorage.setItem('sesion', JSON.stringify(usuario));
    setSesion(usuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sesion');
    setSesion(null);
  };

  return (
    <AuthContext.Provider value={{ sesion, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}
