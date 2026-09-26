import { useEffect, useState } from 'react'
import { apiRequest, apiRoutes } from '../services/api'
import './dashboard.css'

type MonthlySale = { month: string; total: number }
type BranchSale = { branch: string; total: number }
type ProductRotation = { product: string; stock: number; sold_quantity: number; rotation: number }
type ActivityRecord = { id: number; resource: string; label: string; created_at: string }
type TargetProgress = { id: number; name: string; actual: number; goal: number; completion_percent: number; unit: string }
type DashboardReport = {
  sales: { current: number; records: number }
  inventory: { quantity: number; records: number }
  operations: { completed: number }
  companies: number
  branches: number
  products: number
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
  const [report, setReport] = useState(initialReport)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest<DashboardReport>(apiRoutes.reports)
      .then(setReport)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'No se pudieron consultar los datos.')
      })
      .finally(() => setLoading(false))
  }, [])

  const maxMonthlyTotal = Math.max(...report.sales_by_month.map((item) => item.total), 1)
  const kpis = [
    { label: 'Ventas acumuladas', value: currency.format(report.sales.current), detail: `${report.sales.records} registros`, icon: '↗', tone: 'primary' },
    { label: 'Ventas registradas', value: String(report.sales.records), detail: 'Transacciones persistidas', icon: '▤', tone: 'info' },
    { label: 'Unidades en inventario', value: report.inventory.quantity.toLocaleString('es-PE'), detail: `${report.inventory.records} registros`, icon: '◈', tone: 'warning' },
    { label: 'Metas comerciales', value: String(report.active_targets), detail: `${report.targets} configuradas`, icon: '◎', tone: 'warning' },
    { label: 'Operaciones recientes', value: String(report.processing.operations_last_30_days), detail: 'Últimos 30 días', icon: '⌁', tone: 'success' },
  ]

  return <div className="dashboard-page">
    <div className="dashboard-heading">
      <div><div className="breadcrumb-line"><span>Inicio</span><span>/</span><b>Dashboard</b></div><h1>Dashboard ejecutivo</h1><p>Indicadores sincronizados con la base de datos.</p></div>
    </div>
    {error && <p className="dashboard-error" role="alert">{error}</p>}
    <section className="kpi-grid" aria-label="Indicadores ejecutivos">
      {kpis.map((kpi) => <article className={`stat-card ${kpi.tone}`} key={kpi.label}>
        <div className="stat-card-body"><div><span className="stat-label">{kpi.label}</span><strong>{loading ? '...' : kpi.value}</strong></div><span className="stat-icon">{kpi.icon}</span></div>
        <div className="stat-card-footer"><b>{loading ? 'Consultando' : kpi.detail}</b><span>PostgreSQL</span></div>
      </article>)}
    </section>
    <section className="chart-grid">
      <article className="content-card chart-card">
        <div className="card-header"><div><h2>Ventas mensuales</h2><p>Importes agrupados por mes de creación</p></div></div>
        <div className="chart-total"><strong>{loading ? '...' : currency.format(report.sales.current)}</strong><span>{report.sales.records} registros</span></div>
        <div className="sales-chart">
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
        <div className="card-header"><div><h2>Rotación de inventario</h2><p>Unidades vendidas frente al stock disponible</p></div></div>
        <div className="rotation-list">{report.inventory_rotation.slice(0, 6).map((item) => <div className="rotation-row" key={item.product}><div><span>{item.product}</span><b>{item.rotation.toFixed(2)}×</b></div><small>{item.sold_quantity} vendidas · {item.stock} en stock</small><i><em style={{ width: `${Math.min(100, Math.max(item.rotation * 25, item.stock ? 6 : 0))}%` }} /></i></div>)}{!loading && report.inventory_rotation.length === 0 && <p className="dashboard-empty">Registra productos e inventario para iniciar el análisis de rotación.</p>}</div>
      </article>
    </section>
    <section className="data-grid">
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
        <div className="card-header"><div><h2>Avance de metas</h2><p>Cumplimiento en el período definido</p></div></div>
        <div className="dashboard-target-list">{report.target_progress.slice(0, 5).map((target) => <div key={target.id}><div><b>{target.name}</b><span>{target.completion_percent}%</span></div><i><em style={{ width: `${Math.min(100, target.completion_percent)}%` }} /></i><small>{target.actual.toLocaleString('es-PE')} / {target.goal.toLocaleString('es-PE')} {target.unit}</small></div>)}{!loading && report.target_progress.length === 0 && <p className="dashboard-empty">Crea una meta para ver el progreso comercial.</p>}</div>
      </article>
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Actividad reciente</h2><p>Últimos cambios en el espacio de trabajo</p></div></div>
        <div className="dashboard-activity-list">{report.recent_activity.slice(0, 6).map((activity) => <div key={`${activity.resource}-${activity.id}`}><span>{activity.resource}</span><b>{activity.label}</b><time>{new Date(activity.created_at).toLocaleString()}</time></div>)}{!loading && report.recent_activity.length === 0 && <p className="dashboard-empty">La actividad aparecerá cuando se registren datos.</p>}</div>
      </article>
    </section>
  </div>
}
