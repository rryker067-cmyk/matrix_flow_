import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext' // Asegúrate de que la ruta apunte correctamente a tu AuthContext
import './nav.css'

type NavigationItem = { label: string; path: string; icon: string }

const mainNavigation: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '▦' },
  { label: 'Ventas', path: '/ventas', icon: '↗' },
  { label: 'Inventario', path: '/inventario', icon: '▤' },
]

const companyNavigation: NavigationItem[] = [
  { label: 'Resumen de empresa', path: '/empresa', icon: '⌂' },
  { label: 'Sucursales', path: '/sucursales', icon: '⌗' },
  { label: 'Productos', path: '/productos', icon: '□' },
]

const analysisNavigation: NavigationItem[] = [
  { label: 'Vectores', path: '/vectores', icon: '◇' },
  { label: 'Matrices', path: '/matrices', icon: '▧' },
  { label: 'Operaciones', path: '/operaciones', icon: '∑' },
  { label: 'Combinaciones lineales', path: '/combinaciones-lineales', icon: '⌁' },
]

function NavigationLink({ item, nested = false }: { item: NavigationItem; nested?: boolean }) {
  return <NavLink to={item.path} className={({ isActive }) => `nav-item ${nested ? 'nav-item-nested' : ''} ${isActive ? 'active' : ''}`}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></NavLink>
}

function NavigationGroup({ label, icon, items, open, onToggle, collapsed }: { label: string; icon: string; items: NavigationItem[]; open: boolean; onToggle: () => void; collapsed: boolean }) {
  return <div className={`nav-group ${open ? 'open' : ''}`}>
    <button className="nav-group-trigger" type="button" onClick={onToggle} aria-expanded={open} title={collapsed ? label : undefined}><span className="nav-icon">{icon}</span><span>{label}</span><b>⌄</b></button>
    {open && !collapsed && <div className="nav-group-items">{items.map((item) => <NavigationLink key={item.path} item={item} nested />)}</div>}
  </div>
}

export function AppLayout() {
  const location = useLocation()
  const { logout } = useAuth() // Obtenemos la función para cerrar sesión
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('matrixflow|sidebar') !== 'closed')
  const companyActive = companyNavigation.some((item) => location.pathname === item.path)
  const analysisActive = analysisNavigation.some((item) => location.pathname === item.path)
  const [companyOpen, setCompanyOpen] = useState(companyActive)
  const [analysisOpen, setAnalysisOpen] = useState(analysisActive)

  const toggleSidebar = () => {
    setSidebarOpen((open) => {
      localStorage.setItem('matrixflow|sidebar', open ? 'closed' : 'open')
      return !open
    })
  }

  return <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
    <header className="topbar">
      <button className="sidebar-toggle" type="button" onClick={toggleSidebar} aria-label="Mostrar u ocultar menú">☰</button>
      <NavLink className="topbar-brand" to="/dashboard"><span className="brand-mark">M</span><span>MatrixFlow <b>Enterprise</b></span></NavLink>
      <div className="topbar-search"><span>⌕</span><input aria-label="Buscar" placeholder="Buscar en MatrixFlow..." /><kbd>⌘ K</kbd></div>
      
      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="topbar-icon" aria-label="Notificaciones">♢<i /></button>
        
        {/* Menú de usuario original */}
        <button className="user-menu" aria-label="Abrir menú de usuario" type="button">
          <span className="avatar">LM</span>
          <span className="user-summary"><b>Laura Méndez</b><small>Administradora</small></span>
          <span>⌄</span>
        </button>

        {/* Botón de cerrar sesión ubicado de forma limpia al lado */}
        <button 
          onClick={logout} 
          type="button"
          title="Cerrar sesión"
          style={{
            padding: '0.4rem 0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Cerrar Sesion
        </button>
      </div>
    </header>

    <aside className="sidebar">
      <div className="sidebar-workspace"><span className="eyebrow">ESPACIO DE TRABAJO</span><strong>Grupo Horizonte</strong><span>⌄</span></div>
      <nav className="navigation" aria-label="Navegación principal">
        <span className="nav-label">PRINCIPAL</span>
        {mainNavigation.map((item) => <NavigationLink key={item.path} item={item} />)}
        <span className="nav-label">GESTIÓN EMPRESARIAL</span>
        <NavigationGroup label="Empresa" icon="⌂" items={companyNavigation} open={companyOpen} onToggle={() => setCompanyOpen((open) => !open)} collapsed={!sidebarOpen} />
        <span className="nav-label">ANÁLISIS MATEMÁTICO</span>
        <NavigationGroup label="Análisis analítico" icon="∑" items={analysisNavigation} open={analysisOpen} onToggle={() => setAnalysisOpen((open) => !open)} collapsed={!sidebarOpen} />
        <span className="nav-label">SISTEMA</span>
        <NavigationLink item={{ label: 'Historial', path: '/historial', icon: '◷' }} />
        <NavigationLink item={{ label: 'Reportes', path: '/reportes', icon: '▥' }} />
        <NavigationLink item={{ label: 'Usuarios', path: '/usuarios', icon: '♙' }} />
        <NavigationLink item={{ label: 'Configuración', path: '/configuracion', icon: '⚙' }} />
      </nav>
      <div className="sidebar-footer"><div className="sidebar-status"><i /> API simulada <span>v0.1</span></div><small>MatrixFlow Enterprise<br />Plan maestro · Fase 1</small></div>
    </aside>

    <main className="main-content"><div className="page-content"><Outlet /></div><footer className="app-footer"><span>© 2026 MatrixFlow Enterprise</span><span>Fase 1 · Datos simulados</span></footer></main>
  </div>
}