import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { apiRequest, apiRoutes } from '../services/api'
import './module-page.css'

type Row = Record<string, string>
type ModuleConfig = {
  title: string
  description: string
  singular: string
  collection?: string
  endpoint?: string
  columns: { key: string; label: string }[]
  readOnly?: boolean
  report?: boolean
}

const modules: Record<string, ModuleConfig> = {
  empresa: { title: 'Empresa', description: 'Información corporativa.', singular: 'empresa', collection: 'companies', columns: [{ key: 'name', label: 'Razón social' }, { key: 'tax_id', label: 'Identificación fiscal' }, { key: 'city', label: 'Ciudad' }, { key: 'status', label: 'Estado' }] },
  sucursales: { title: 'Sucursales', description: 'Sedes y responsables.', singular: 'sucursal', collection: 'branches', columns: [{ key: 'name', label: 'Sucursal' }, { key: 'city', label: 'Ciudad' }, { key: 'manager', label: 'Responsable' }, { key: 'code', label: 'Código' }] },
  productos: { title: 'Productos', description: 'Catálogo y existencias.', singular: 'producto', collection: 'products', columns: [{ key: 'name', label: 'Producto' }, { key: 'category', label: 'Categoría' }, { key: 'price', label: 'Precio' }, { key: 'stock', label: 'Stock' }] },
  ventas: { title: 'Ventas', description: 'Transacciones registradas.', singular: 'venta', collection: 'sales', columns: [{ key: 'code', label: 'Pedido' }, { key: 'branch', label: 'Sucursal' }, { key: 'customer', label: 'Cliente' }, { key: 'amount', label: 'Importe' }, { key: 'status', label: 'Estado' }] },
  inventario: { title: 'Inventario', description: 'Existencias y movimientos.', singular: 'movimiento', collection: 'inventory', columns: [{ key: 'product', label: 'Producto' }, { key: 'branch', label: 'Sucursal' }, { key: 'quantity', label: 'Cantidad' }, { key: 'movement', label: 'Movimiento' }] },
  vectores: { title: 'Vectores', description: 'Datos unidimensionales para análisis.', singular: 'vector', collection: 'vectors', columns: [{ key: 'name', label: 'Nombre' }, { key: 'values', label: 'Valores JSON' }, { key: 'source', label: 'Origen' }] },
  matrices: { title: 'Matrices', description: 'Datos multidimensionales para análisis.', singular: 'matriz', collection: 'matrices', columns: [{ key: 'name', label: 'Nombre' }, { key: 'values', label: 'Valores JSON' }, { key: 'source', label: 'Origen' }] },
  operaciones: { title: 'Operaciones', description: 'Resultados de cálculos ejecutados.', singular: 'operación', collection: 'operations', readOnly: true, columns: [{ key: 'operation', label: 'Operación' }, { key: 'result', label: 'Resultado' }, { key: 'status', label: 'Estado' }, { key: 'executed_at', label: 'Fecha' }] },
  historial: { title: 'Historial', description: 'Trazabilidad de operaciones.', singular: 'registro', collection: 'operations', readOnly: true, columns: [{ key: 'operation', label: 'Operación' }, { key: 'result', label: 'Resultado' }, { key: 'status', label: 'Estado' }, { key: 'executed_at', label: 'Fecha' }] },
  'combinaciones-lineales': { title: 'Combinaciones lineales', description: 'Historial de cálculos lineales.', singular: 'operación', collection: 'operations', readOnly: true, columns: [{ key: 'operation', label: 'Operación' }, { key: 'result', label: 'Resultado' }, { key: 'status', label: 'Estado' }] },
  reportes: { title: 'Reportes', description: 'Métricas calculadas a partir de los datos persistidos.', singular: 'reporte', report: true, readOnly: true, columns: [{ key: 'metric', label: 'Métrica' }, { key: 'value', label: 'Valor' }] },
  usuarios: { title: 'Usuarios', description: 'Usuarios y roles del sistema.', singular: 'usuario', collection: 'users', endpoint: apiRoutes.users, readOnly: true, columns: [{ key: 'name', label: 'Nombre' }, { key: 'email', label: 'Correo' }, { key: 'role', label: 'Rol' }, { key: 'status', label: 'Estado' }] },
  configuracion: { title: 'Configuración', description: 'Configuración del espacio de trabajo.', singular: 'parámetro', collection: 'configurations', columns: [{ key: 'name', label: 'Parámetro' }, { key: 'value', label: 'Valor' }] },
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

export function PlaceholderPage() {
  const location = useLocation()
  const key = location.pathname.split('/')[1] || 'empresa'
  const config = modules[key]
  if (!config) return <section className="empty-page"><span className="eyebrow">MÓDULO MATRIXFLOW</span><h1>Página no encontrada</h1><p>La ruta solicitada no existe.</p></section>
  return <ModulePage key={key} config={config} />
}

function ModulePage({ config }: { config: ModuleConfig }) {
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | null>(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let active = true
    const request = config.collection
      ? apiRequest<Record<string, unknown>[]>(config.endpoint ?? `${apiRoutes.resources}/${config.collection}`)
        .then((records) => records.map((record) => Object.fromEntries(Object.entries(record).map(([key, value]) => [key, displayValue(value)]))))
      : config.report
        ? apiRequest<Record<string, unknown>>(apiRoutes.reports)
          .then((report) => Object.entries(report).map(([metric, value]) => ({ metric, value: displayValue(value) })))
        : Promise.resolve([])

    void request.then((loadedRows) => {
      if (active) {
        setRows(loadedRows)
        setError('')
      }
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los datos.')
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => { active = false }
  }, [config.collection, config.endpoint, config.report, refresh])

  const filteredRows = rows.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(query.toLowerCase())))

  const saveRow = async () => {
    if (!editing || !config.collection) return
    const payload: Record<string, unknown> = {}
    for (const [key, rawValue] of Object.entries(editing)) {
      if (key === 'id') continue
      if (['price', 'stock', 'amount', 'quantity'].includes(key)) {
        payload[key] = rawValue === '' ? 0 : Number(rawValue)
      } else if (['values', 'result'].includes(key) && rawValue.startsWith('[')) {
        try { payload[key] = JSON.parse(rawValue) } catch { payload[key] = rawValue }
      } else {
        payload[key] = rawValue
      }
    }
    try {
      const recordId = editing.id
      const endpoint = `${apiRoutes.resources}/${config.collection}${recordId ? `/${recordId}` : ''}`
      await apiRequest(endpoint, { method: recordId ? 'PUT' : 'POST', body: JSON.stringify(payload) })
      setEditing(null)
      setLoading(true)
      setRefresh((value) => value + 1)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo guardar el registro.')
    }
  }

  const removeRow = async (id: string) => {
    if (!config.collection) return
    try {
      await apiRequest(`${apiRoutes.resources}/${config.collection}/${id}`, { method: 'DELETE' })
      setLoading(true)
      setRefresh((value) => value + 1)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar el registro.')
    }
  }

  const startNew = () => setEditing(Object.fromEntries(config.columns.map((column) => [column.key, ''])))
  const canEdit = Boolean(config.collection && !config.readOnly)

  return <section className="module-page">
    <div className="module-heading"><div><div className="breadcrumb-line"><span>Inicio</span><span>/</span><b>{config.title}</b></div><h1>{config.title}</h1><p>{config.description}</p></div>{canEdit && <button className="module-primary" onClick={startNew}>＋ Nueva {config.singular}</button>}</div>
    <div className="module-toolbar"><div className="module-count"><strong>{rows.length}</strong> registros</div><div className="module-actions"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar ${config.title.toLowerCase()}...`} aria-label={`Buscar ${config.title}`} /></div></div>
    {error && <p role="alert" className="module-error">{error}</p>}
    <div className="module-card"><div className="module-table-wrap"><table className="module-table"><thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}{canEdit && <th className="actions-column">Acciones</th>}</tr></thead><tbody>
      {filteredRows.map((row) => <tr key={row.id ?? row.metric ?? `${row.operation}-${row.executed_at}`}>{config.columns.map((column) => <td key={column.key}>{row[column.key]}</td>)}{canEdit && <td className="row-actions"><button onClick={() => setEditing({ ...row })} aria-label={`Editar ${config.singular}`}>✎</button><button onClick={() => void removeRow(row.id)} aria-label={`Eliminar ${config.singular}`}>⌫</button></td>}</tr>)}
    </tbody></table>{loading ? <div className="module-empty">Consultando el servidor...</div> : filteredRows.length === 0 && <div className="module-empty">{config.collection || config.report ? 'No hay datos persistidos todavía.' : 'Este módulo aún no tiene un endpoint de datos.'}</div>}</div><div className="module-card-footer">Mostrando {filteredRows.length} de {rows.length} registros <span>{config.collection || config.report ? 'Sincronizado con Supabase vía FastAPI' : 'Módulo pendiente de integración'}</span></div></div>
    {editing && canEdit && <div className="module-form-card"><div className="module-form-heading"><div><span className="eyebrow">REGISTRO PERSISTENTE</span><h2>{editing.id ? `Editar ${config.singular}` : `Nueva ${config.singular}`}</h2></div><button onClick={() => setEditing(null)} aria-label="Cerrar formulario">×</button></div><div className="module-form-grid">{config.columns.map((column) => <label key={column.key}>{column.label}<input value={editing[column.key] || ''} onChange={(event) => setEditing({ ...editing, [column.key]: event.target.value })} /></label>)}</div><div className="module-form-actions"><button className="module-cancel" onClick={() => setEditing(null)}>Cancelar</button><button className="module-primary" onClick={() => void saveRow()}>Guardar</button></div></div>}
  </section>
}
