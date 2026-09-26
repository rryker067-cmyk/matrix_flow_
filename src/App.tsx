import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { OperationsPage } from './pages/operations-page';
import { ReportsPage } from './pages/reports-page';
import { UsersPage } from './pages/users-page';
import { HistoryPage } from './pages/history-page';
import { MathDataPage } from './pages/math-data-page';
import { PlaceholderPage } from './pages/PlaceholderPage';
import './App.css';

// Componente para proteger las rutas privadas del Dashboard
const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. EL HOME ES LA VISTA PRINCIPAL (RAÍZ) */}
          <Route path="/" element={<HomePage />} />

          {/* 2. PÁGINA DE AUTENTICACIÓN (LOGIN / REGISTRO) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. SISTEMA PRINCIPAL / DASHBOARD PROTEGIDO */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vectores" element={<MathDataPage kind="vectors" />} />
            <Route path="/matrices" element={<MathDataPage kind="matrices" />} />
            <Route path="/operaciones" element={<OperationsPage />} />
            <Route path="/combinaciones-lineales" element={<OperationsPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/historial" element={<HistoryPage />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>

          {/* Comodín por si escriben cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}