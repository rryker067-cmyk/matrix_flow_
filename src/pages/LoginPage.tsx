import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './login.css';

export const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('admin@matrixflow.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (isRegistering) {
        if (!name.trim()) throw new Error('Por favor ingresa tu nombre completo.');
        login(email, 'mock-jwt-token-registered', name);
        navigate('/dashboard', { replace: true });
      } else {
        if (email === 'admin@matrixflow.com' && password === 'password123') {
          login(email, 'mock-jwt-token-enterprise', 'Laura Méndez');
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Credenciales incorrectas. Usa el botón de acceso rápido.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error en el proceso.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('usuario.google@matrixflow.com', 'mock-google-token', 'Usuario Google');
      navigate('/dashboard', { replace: true });
    }, 600);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Cabecera corporativa */}
        <div className="login-header">
          <div className="login-brand">
            <span className="login-brand-mark">M</span>
            <span>MatrixFlow <b>Enterprise</b></span>
          </div>
          <p className="login-subtitle">
            {isRegistering ? 'Crea una cuenta corporativa nueva' : 'Accede a tu espacio de trabajo'}
          </p>
        </div>

        {/* Sistema de Pestañas (Tabs) */}
        <div className="login-tabs">
          <button 
            type="button" 
            className={`login-tab-btn ${!isRegistering ? 'active' : ''}`}
            onClick={() => { setIsRegistering(false); setError(''); }}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            className={`login-tab-btn ${isRegistering ? 'active' : ''}`}
            onClick={() => { setIsRegistering(true); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        {/* Mensaje de Error */}
        {error && <div className="login-error">{error}</div>}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit}>
          
          {isRegistering && (
            <div className="login-form-group">
              <label className="login-label">Nombre completo</label>
              <div className="login-input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Laura Méndez"
                  className="login-input"
                />
              </div>
            </div>
          )}

          <div className="login-form-group">
            <label className="login-label">Correo electrónico</label>
            <div className="login-input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@matrixflow.com"
                className="login-input"
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Ingresar al Sistema')}
          </button>
        </form>

        {!isRegistering && (
          <button type="button" onClick={handleFillDemo} className="login-demo-helper">
            ⚡ Rellenar con credenciales de prueba
          </button>
        )}

        {/* Divisor "o" */}
        <div className="login-divider">o continuar con</div>

        {/* Botón de Google en Blanco con Logotipo (ubicado abajo) */}
        <button type="button" onClick={handleGoogleLogin} className="google-btn">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.99 0 12s.43 3.88 1.18 5.4l4.09-3.16z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          Google Workspace
        </button>

        <div className="login-footer-help">
          {isRegistering ? 'Al registrarte aceptas los términos corporativos.' : <>Demo: <code>admin@matrixflow.com</code> / <code>password123</code></>}
        </div>

      </div>
    </div>
  );
};