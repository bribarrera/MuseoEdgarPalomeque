// context/loading_context.tsx — loading global con loadingCard.gif
import { createContext, useContext, useState, ReactNode } from 'react';

type LoadingCtx = { setLoading: (v: boolean) => void };
const LoadingContext = createContext<LoadingCtx>({ setLoading: () => {} });

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-12 py-8 flex flex-col items-center gap-4">
            <img src="/loadingCard.gif" alt="cargando" className="w-20 h-20" />
            <p className="text-lg font-semibold text-gray-800">Cargando...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() { return useContext(LoadingContext); }
