import { useEffect, useState } from 'react'
import { apiRequest, apiRoutes } from '../services/api'
import './dashboard.css'

type MonthlySale = { month: string; total: number }
type BranchSale = { branch: string; total: number }
type DashboardReport = {
  sales: { current: number; records: number }
  inventory: { quantity: number; records: number }
  operations: { completed: number }
  companies: number
  branches: number
  products: number
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
    { label: 'Operaciones matemáticas', value: String(report.operations.completed), detail: 'Resultados guardados', icon: '⌁', tone: 'success' },
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
      <article className="content-card table-card">
        <div className="card-header"><div><h2>Ventas por sucursal</h2><p>Distribución basada en ventas guardadas</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Sucursal</th><th>Ventas</th></tr></thead><tbody>
          {report.sales_by_branch.map((branch) => <tr key={branch.branch}><td>{branch.branch}</td><td>{currency.format(branch.total)}</td></tr>)}
        </tbody></table>{!loading && report.sales_by_branch.length === 0 && <p className="dashboard-empty">No hay sucursales con ventas registradas.</p>}</div>
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
    </section>
  </div>
}
