import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import { apiRequest, apiRoutes } from '../services/api'
import './dashboard.css'

type MonthlySale = { month: string; total: number }
type BranchSale = { branch: string; total: number }
type ProductRotation = { product: string; stock: number; sold_quantity: number; rotation: number }
type ActivityRecord = { id: number; resource: string; label: string; created_at: string }
type TargetProgress = { id: number; name: string; actual: number; goal: number; completion_percent: number; unit: string; period_active: boolean }
type DashboardReport = {
  sales: { current: number; records: number }
  inventory: { quantity: number; records: number }
  operations: { completed: number }
  companies: number
  branches: number
  products: number
  vectors: number
  matrices: number
  targets: number
  active_targets: number
  processing: { operations_last_30_days: number }
  inventory_rotation: ProductRotation[]
  recent_activity: ActivityRecord[]
  target_progress: TargetProgress[]
  sales_by_month: MonthlySale[]
  sales_by_branch: BranchSale[]
}

const initialReport: DashboardReport = {
  sales: { current: 0, records: 0 },
  inventory: { quantity: 0, records: 0 },
  operations: { completed: 0 },
  companies: 0,
  branches: 0,
  products: 0,
  vectors: 0,
  matrices: 0,
  targets: 0,
  active_targets: 0,
  processing: { operations_last_30_days: 0 },
  inventory_rotation: [],
  recent_activity: [],
  target_progress: [],
  sales_by_month: [],
  sales_by_branch: [],
}

const currency = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0,
})

export function DashboardPage() {
  const { user } = useAuth()
  const role = user?.role ?? 'viewer'
  const isAdmin = role === 'admin'
  const isMember = role === 'member'
  const isAnalyst = role === 'analyst'
  const isViewer = role === 'viewer'
  const [report, setReport] = useState(initialReport)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    apiRequest<DashboardReport>(apiRoutes.reports)
      .then((data) => {
        setReport(data)
        setUpdatedAt(new Date())
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'No se pudieron consultar los datos.')
      })
      .finally(() => setLoading(false))
  }, [])

  const maxMonthlyTotal = Math.max(...report.sales_by_month.map((item) => item.total), 1)
  const featuredTarget = report.target_progress.find((target) => target.period_active) ?? report.target_progress[0]
  const featuredTargetProgress = Math.min(100, Math.max(0, featuredTarget?.completion_percent ?? 0))
  const executiveKpis = [
    { label: 'Ventas acumuladas', value: currency.format(report.sales.current), detail: `${report.sales.records} registros`, icon: '↗', tone: 'primary' },
    { label: 'Ventas registradas', value: String(report.sales.records), detail: 'Transacciones persistidas', icon: '▤', tone: 'info' },
    { label: 'Unidades en inventario', value: report.inventory.quantity.toLocaleString('es-PE'), detail: `${report.inventory.records} registros`, icon: '◈', tone: 'warning' },
    { label: 'Metas comerciales', value: String(report.active_targets), detail: `${report.targets} configuradas`, icon: '◎', tone: 'warning' },
    { label: 'Operaciones recientes', value: String(report.processing.operations_last_30_days), detail: 'Últimos 30 días', icon: '⌁', tone: 'success' },
  ]
  const kpis = isAdmin ? executiveKpis : isAnalyst ? [
    { label: 'Operaciones matemáticas', value: String(report.operations.completed), detail: 'Operaciones guardadas', icon: '∑', tone: 'primary' },
    { label: 'Vectores', value: String(report.vectors), detail: 'Recursos disponibles', icon: '◇', tone: 'info' },
    { label: 'Matrices', value: String(report.matrices), detail: 'Recursos disponibles', icon: '▧', tone: 'success' },
  ] : isMember ? [
    executiveKpis[0], executiveKpis[2], executiveKpis[4],
  ] : [
    executiveKpis[0], executiveKpis[1], executiveKpis[2],
  ]
  const dashboardTitle = isAdmin ? 'Dashboard ejecutivo' : isMember ? 'Panel operativo' : isAnalyst ? 'Panel de análisis' : 'Panel de reportes'
  const dashboardDescription = isAdmin
    ? 'Indicadores completos de operación y administración.'
    : isMember
      ? 'Resumen de ventas, inventario y análisis matemático.'
      : isAnalyst
        ? 'Actividad de vectores, matrices y operaciones.'
        : 'Indicadores disponibles en modo de solo lectura.'

  return <div className="dashboard-page">
    <section className="dashboard-brandbar" aria-label="Estado del espacio de trabajo">
      <div className="dashboard-brand-lockup"><span className="dashboard-brand-mark">M</span><span><strong>MATRIXFLOW</strong><small>ENTERPRISE</small></span></div>
      <div className={`dashboard-sync ${error ? 'offline' : ''}`}><i /> <span><small>ÚLTIMA ACTUALIZACIÓN</small><strong>{loading ? 'Sincronizando…' : error ? 'Sin conexión' : `Hoy, ${updatedAt?.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`}</strong></span><b>{error ? 'Sin conexión' : loading ? 'Actualizando' : 'En línea'}</b></div>
    </section>
    <div className="dashboard-heading">
      <div><div className="breadcrumb-line"><span>Inicio</span><span>/</span><b>Dashboard</b></div><h1>{dashboardTitle}</h1><p>{dashboardDescription}</p></div>
    </div>
    {error && <p className="dashboard-error" role="alert">{error}</p>}
    <section className={`kpi-grid ${kpis.length < 5 ? 'compact-kpis' : ''}`} aria-label="Indicadores del dashboard">
      {kpis.map((kpi) => <article className={`stat-card ${kpi.tone}`} key={kpi.label}>
        <div className="stat-card-body"><div><span className="stat-label">{kpi.label}</span><strong>{loading ? '...' : kpi.value}</strong></div><span className="stat-icon">{kpi.icon}</span></div>
        <div className="stat-card-footer"><b>{loading ? 'Consultando' : kpi.detail}</b><span>PostgreSQL</span></div>
      </article>)}
    </section>
    {!isAnalyst && <section className="chart-grid">
      <article className="content-card chart-card">
        <div className="card-header"><div><h2>Ventas mensuales</h2><p>Importes agrupados por mes de creación</p></div></div>
        <div className="chart-total"><strong>{loading ? '...' : currency.format(report.sales.current)}</strong><span>{report.sales.records} registros</span></div>
        <div className="sales-chart" role="img" aria-label="Ventas acumuladas por mes durante los últimos doce meses">
          <div className="chart-y-axis"><span>{currency.format(maxMonthlyTotal)}</span><span>{currency.format(maxMonthlyTotal / 2)}</span><span>{currency.format(0)}</span></div>
          <div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /></div><div className="chart-bars">
            {report.sales_by_month.map((item, index) => <div className="bar-column" key={item.month} title={`${item.month}: ${currency.format(item.total)}`}>
              <div className={`chart-bar ${index === report.sales_by_month.length - 1 ? 'current' : ''}`} style={{ height: `${Math.max((item.total / maxMonthlyTotal) * 90, item.total > 0 ? 10 : 0)}%` }} />
              <span>{new Intl.DateTimeFormat('es', { month: 'short' }).format(new Date(`${item.month}-01T00:00:00`))}</span>
            </div>)}
          </div></div>
        </div>
        {!loading && report.sales_by_month.every((item) => item.total === 0) && <p className="dashboard-empty">Aún no hay ventas para graficar.</p>}
      </article>
      <article className="content-card table-card rotation-card">
        <div className="card-header"><div><h2>Rotación de inventario</h2><p>Unidades vendidas acumuladas frente al stock actual</p></div></div>
        <p className="dashboard-guidance">Fórmula: unidades vendidas ÷ existencias actuales. Registra el mismo producto en Productos, Inventario y Ventas para poder relacionar los datos.</p>
        <div className="rotation-list">{report.inventory_rotation.slice(0, 6).map((item) => <div className="rotation-row" key={item.product}><div><span>{item.product}</span><b>{item.rotation.toFixed(2)}×</b></div><small>{item.sold_quantity} vendidas · {item.stock} en stock</small><i><em style={{ width: `${Math.min(100, Math.max(item.rotation * 25, item.stock ? 6 : 0))}%` }} /></i></div>)}{!loading && report.inventory_rotation.length === 0 && <p className="dashboard-empty">{report.products === 0 ? 'No hay productos de catálogo. Crea un producto para iniciar el cálculo.' : report.inventory.records === 0 ? 'No hay movimientos de inventario; registra entradas, salidas o ajustes.' : 'Registra ventas con el nombre del producto para calcular las unidades vendidas.'}</p>}</div>
      </article>
    </section>}
    {isAdmin && <section className="data-grid">
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Registros sincronizados</h2><p>Conteos leídos de PostgreSQL</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Recurso</th><th>Total</th></tr></thead><tbody>
          <tr><td>Empresas</td><td>{loading ? '...' : report.companies}</td></tr>
          <tr><td>Sucursales</td><td>{loading ? '...' : report.branches}</td></tr>
          <tr><td>Productos</td><td>{loading ? '...' : report.products}</td></tr>
          <tr><td>Inventario</td><td>{loading ? '...' : report.inventory.records}</td></tr>
          <tr><td>Operaciones</td><td>{loading ? '...' : report.operations.completed}</td></tr>
        </tbody></table></div>
      </article>
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Avance de metas</h2><p>Ventas dentro del período definido</p></div></div>
        <p className="dashboard-guidance">Crea una meta con fechas y objetivo de importe o unidades. El avance cuenta ventas del período y aplica los filtros opcionales de sucursal y producto.</p>
        {featuredTarget && <div className="dashboard-featured-target"><div className="dashboard-target-ring" role="img" aria-label={`Cumplimiento de ${featuredTarget.name}: ${featuredTarget.completion_percent}%`} style={{ background: `conic-gradient(var(--blue) ${featuredTargetProgress}%, #303944 ${featuredTargetProgress}% 100%)` }}><div><strong>{featuredTarget.completion_percent.toLocaleString('es-PE')}<small>%</small></strong><span>{featuredTarget.period_active ? 'En curso' : 'Fuera de período'}</span></div></div><div className="dashboard-target-details"><span>META DESTACADA</span><strong>{featuredTarget.name}</strong><div><small>Actual</small><b>{featuredTarget.actual.toLocaleString('es-PE')} {featuredTarget.unit}</b></div><div><small>Objetivo</small><b>{featuredTarget.goal.toLocaleString('es-PE')} {featuredTarget.unit}</b></div></div></div>}
        {report.target_progress.length > 1 && <div className="dashboard-target-list">{report.target_progress.filter((target) => target.id !== featuredTarget?.id).slice(0, 3).map((target) => <div key={target.id}><div><b>{target.name}</b><span>{target.completion_percent}%</span></div><i><em style={{ width: `${Math.min(100, target.completion_percent)}%` }} /></i><small>{target.actual.toLocaleString('es-PE')} / {target.goal.toLocaleString('es-PE')} {target.unit}</small></div>)}</div>}
        {!loading && report.target_progress.length === 0 && <p className="dashboard-empty">Todavía no hay metas. Ve a Metas y crea una con fechas válidas y un objetivo de importe o unidades.</p>}
      </article>
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Actividad reciente</h2><p>Últimos cambios en el espacio de trabajo</p></div></div>
        <div className="dashboard-activity-list">{report.recent_activity.slice(0, 6).map((activity) => <div key={`${activity.resource}-${activity.id}`}><span>{activity.resource}</span><b>{activity.label}</b><time>{new Date(activity.created_at).toLocaleString()}</time></div>)}{!loading && report.recent_activity.length === 0 && <p className="dashboard-empty">La actividad aparecerá cuando se registren datos.</p>}</div>
      </article>
    </section>}
    {isMember && <section className="data-grid">
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Recursos del espacio</h2><p>Datos base disponibles para consulta</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Recurso</th><th>Total</th></tr></thead><tbody>
          <tr><td>Empresas</td><td>{loading ? '...' : report.companies}</td></tr>
          <tr><td>Sucursales</td><td>{loading ? '...' : report.branches}</td></tr>
          <tr><td>Productos</td><td>{loading ? '...' : report.products}</td></tr>
        </tbody></table></div>
      </article>
    </section>}
    {isAnalyst && <section className="data-grid">
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Recursos matemáticos</h2><p>Vectores y matrices disponibles para análisis</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Recurso</th><th>Total</th></tr></thead><tbody>
          <tr><td>Vectores</td><td>{loading ? '...' : report.vectors}</td></tr>
          <tr><td>Matrices</td><td>{loading ? '...' : report.matrices}</td></tr>
          <tr><td>Operaciones ejecutadas</td><td>{loading ? '...' : report.operations.completed}</td></tr>
        </tbody></table></div>
      </article>
    </section>}
    {isViewer && <section className="data-grid">
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Resumen de consulta</h2><p>Totales reportados en el espacio</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Indicador</th><th>Total</th></tr></thead><tbody>
          <tr><td>Empresas</td><td>{loading ? '...' : report.companies}</td></tr>
          <tr><td>Sucursales</td><td>{loading ? '...' : report.branches}</td></tr>
          <tr><td>Productos</td><td>{loading ? '...' : report.products}</td></tr>
        </tbody></table></div>
      </article>
    </section>}
  </div>
}
