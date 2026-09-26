import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <aside style={{ /* tus estilos de la barra lateral */ }}>
      {/* Tus enlaces de navegación actuales: Dashboard, Ventas, Inventario, etc. */}
      
      {/* Sección inferior del Sidebar */}
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '0.625rem',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#f87171',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};