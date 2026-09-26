import { useEffect, useState } from 'react'
import { apiRequest, apiRoutes } from '../services/api'
import './module-page.css'
import './history-page.css'

type Operation = { id: number; operation: string; result: unknown; status: string; executed_at: string; inputs?: Record<string, unknown>; user_email?: string }
const labels: Record<string, string> = { sum_vector: 'Suma de vectores', subtract_vector: 'Resta de vectores', scalar_multiply: 'Escalar vector', dot_product: 'Producto punto', linear_combination: 'Combinación lineal', add_matrix: 'Suma de matrices', subtract_matrix: 'Resta de matrices', multiply_matrix: 'Multiplicación matricial', transpose_matrix: 'Transpuesta', scalar_multiply_matrix: 'Escalar matriz' }

export function HistoryPage() {
  const [rows, setRows] = useState<Operation[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { apiRequest<Operation[]>(`${apiRoutes.resources}/operations`).then(records => setRows(records.reverse())).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudo consultar el historial.')).finally(() => setLoading(false)) }, [])
  const filtered = rows.filter(record => `${record.id} ${record.operation} ${record.status} ${record.user_email ?? ''} ${JSON.stringify(record.result)}`.toLowerCase().includes(query.toLowerCase()))
  const exportCsv = () => {
    const csvRows = [['ID', 'Operación', 'Estado', 'Usuario', 'Fecha', 'Entradas', 'Resultado'], ...filtered.map(row => [String(row.id), labels[row.operation] ?? row.operation, row.status, row.user_email ?? '', row.executed_at, JSON.stringify(row.inputs ?? {}), JSON.stringify(row.result)])]
    const csv = csvRows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'matrixflow-historial.csv'; link.click(); URL.revokeObjectURL(url)
  }
  return <section className="module-page history-page">
    <div className="module-heading"><div><div className="breadcrumb-line"><span>Inicio</span><span>/</span><b>Historial</b></div><h1>Historial de operaciones</h1><p>Entradas, resultados, estado, fecha y usuario responsable.</p></div><button className="module-cancel" type="button" disabled={!rows.length} onClick={exportCsv}>Exportar CSV</button></div>
    {error && <p className="module-error" role="alert">{error}</p>}
    <div className="module-toolbar"><div className="module-count"><strong>{filtered.length}</strong> operaciones</div><div className="module-actions"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar operación, usuario o resultado…" aria-label="Buscar historial" /></div></div>
    <div className="module-card"><div className="module-table-wrap"><table className="module-table"><thead><tr><th>Operación</th><th>Resultado</th><th>Estado</th><th>Usuario</th><th>Fecha</th><th>Entradas</th></tr></thead><tbody>{filtered.map(row => <tr key={row.id}><td>{labels[row.operation] ?? row.operation}</td><td><code>{JSON.stringify(row.result)}</code></td><td><span className={`history-status ${row.status === 'completed' ? 'success' : ''}`}>{row.status}</span></td><td>{row.user_email ?? 'Sistema'}</td><td>{new Date(row.executed_at).toLocaleString()}</td><td><details><summary>Ver entradas</summary><pre>{JSON.stringify(row.inputs ?? {}, null, 2)}</pre></details></td></tr>)}</tbody></table>{loading && <div className="module-empty">Consultando el historial…</div>}{!loading && !filtered.length && <div className="module-empty">No hay operaciones guardadas que coincidan.</div>}</div><div className="module-card-footer">Historial persistido en Supabase · {filtered.length} de {rows.length}</div></div>
  </section>
}
