import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { apiRequest, apiRoutes } from '../services/api';
import './login.css';

type LoginResponse = {
  access_token: string;
  user: { email: string; name: string; role: string };
};

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiRequest<LoginResponse>(apiRoutes.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(result.user.email, result.access_token, result.user.role);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="login-container">
    <div className="login-card">
      <div className="login-header">
        <div className="login-brand"><span className="login-brand-mark">M</span><span>MatrixFlow <b>Enterprise</b></span></div>
        <p className="login-subtitle">Accede a tu espacio de trabajo</p>
      </div>
      {error && <div className="login-error" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label className="login-label" htmlFor="email">Correo electrónico</label>
          <div className="login-input-wrapper"><input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="login-input" /></div>
        </div>
        <div className="login-form-group">
          <label className="login-label" htmlFor="password">Contraseña</label>
          <div className="login-input-wrapper"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="login-input" /><button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Ocultar' : 'Mostrar'}</button></div>
        </div>
        <button type="submit" disabled={loading} className="login-button">{loading ? 'Conectando...' : 'Ingresar al sistema'}</button>
      </form>
      <div className="login-footer-help">El acceso se verifica en el servidor.</div>
    </div>
  </div>;
};
