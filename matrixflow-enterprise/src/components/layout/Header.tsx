import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Asegúrate de que la ruta a tu contexto sea correcta

export const Header: React.FC = () => {
  const { logout } = useAuth(); // <--- Llamamos a la función logout

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
      {/* Elementos que ya tenga tu header (buscador, etc.) */}
      <div className="flex items-center gap-4">
        {/* Tu buscador u otros elementos */}
      </div>

      {/* Sección derecha: Perfil y Botón de Cerrar Sesión */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm">
            LM
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-200">Laura Méndez</p>
            <p className="text-xs text-slate-400">Administradora</p>
          </div>
        </div>

        {/* ---> AQUÍ AGREGAMOS EL BOTÓN DE CERRAR SESIÓN <--- */}
        <button
          onClick={logout}
          className="ml-4 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          title="Cerrar sesión"
        >
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
};