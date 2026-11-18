import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Status = 'Pendiente' | 'Activa' | 'Completada'
type Priority = 'Baja' | 'Media' | 'Alta'
type Theme = 'dark' | 'light'

type Mission = {
  id: number
  name: string
  category: string
  status: Status
  priority: Priority
  createdAt: number
}

type Activity = {
  id: number
  message: string
  time: number
}

const initialMissions: Mission[] = [
  { id: 1, name: 'Reanimar al neón perdido', category: 'Técnica', status: 'Activa', priority: 'Alta', createdAt: 1730000010000 },
  { id: 2, name: 'Descodificar la lluvia azul', category: 'Investigación', status: 'Pendiente', priority: 'Media', createdAt: 1730000020000 },
  { id: 3, name: 'Auditar sueños de la red', category: 'Seguridad', status: 'Completada', priority: 'Alta', createdAt: 1730000030000 },
  { id: 4, name: 'Encontrar al gato cuántico', category: 'Exploración', status: 'Pendiente', priority: 'Baja', createdAt: 1730000040000 },
  { id: 5, name: 'Calibrar el sintetizador orbital', category: 'Operaciones', status: 'Activa', priority: 'Media', createdAt: 1730000050000 },
]

const randomNames = ['Hackear la luna', 'Traducir estática', 'Clonar una constelación', 'Parchear el tiempo', 'Domar el servidor', 'Silenciar el oráculo']
const categories = ['Técnica', 'Investigación', 'Seguridad', 'Exploración', 'Operaciones']

function App() {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('nexus-missions')
    return saved ? JSON.parse(saved) : initialMissions
  })
  const [activity, setActivity] = useState<Activity[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Status | 'Todas'>('Todas')
  const [sort, setSort] = useState<'priority' | 'name' | 'date'>('date')
  const [selected, setSelected] = useState<number[]>([])
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('nexus-theme') as Theme) || 'dark')
  const [editing, setEditing] = useState<Mission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Mission | null>(null)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('nexus-missions', JSON.stringify(missions))
  }, [missions])

  useEffect(() => {
    localStorage.setItem('nexus-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const logActivity = (message: string) => {
    setActivity((items) => [{ id: Date.now(), message, time: Date.now() }, ...items].slice(0, 7))
  }

  const notify = (message: string) => {
    setToast(message)
    logActivity(message)
  }

  const visibleMissions = useMemo(() => {
    const result = missions.filter((mission) => {
      const matchesSearch = `${mission.name} ${mission.category}`.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'Todas' || mission.status === filter
      return matchesSearch && matchesFilter
    })

    return [...result].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'date') return b.createdAt - a.createdAt
      const rank = { Alta: 0, Media: 1, Baja: 2 }
      return rank[a.priority] - rank[b.priority]
    })
  }, [missions, search, filter, sort])

  const counts = useMemo(() => ({
    total: missions.length,
    pending: missions.filter((mission) => mission.status === 'Pendiente').length,
    active: missions.filter((mission) => mission.status === 'Activa').length,
    completed: missions.filter((mission) => mission.status === 'Completada').length,
  }), [missions])

  const addMission = () => {
    const mission: Mission = {
      id: Date.now(),
      name: randomNames[Math.floor(Math.random() * randomNames.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      status: 'Pendiente',
      priority: (['Baja', 'Media', 'Alta'] as Priority[])[Math.floor(Math.random() * 3)],
      createdAt: Date.now(),
    }
    setMissions((items) => [mission, ...items])
    notify(`Misión creada: ${mission.name}`)
  }

  const openEdit = (mission: Mission) => setEditing({ ...mission })

  const updateMission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editing) return
    setMissions((items) => items.map((mission) => mission.id === editing.id ? editing : mission))
    notify(`Misión actualizada: ${editing.name}`)
    setEditing(null)
  }

  const deleteMission = () => {
    if (!deleteTarget) return
    setMissions((items) => items.filter((mission) => mission.id !== deleteTarget.id))
    setSelected((items) => items.filter((id) => id !== deleteTarget.id))
    notify(`Misión eliminada: ${deleteTarget.name}`)
    setDeleteTarget(null)
  }

  const deleteSelected = () => {
    if (!selected.length) return
    setMissions((items) => items.filter((mission) => !selected.includes(mission.id)))
    notify(`${selected.length} misiones eliminadas`)
    setSelected([])
  }

  const reset = () => {
    setMissions(initialMissions)
    setSelected([])
    notify('Laboratorio restaurado')
  }

  const advanceMission = (mission: Mission) => {
    const status: Status = mission.status === 'Pendiente' ? 'Activa' : mission.status === 'Activa' ? 'Completada' : 'Pendiente'
    setMissions((items) => items.map((item) => item.id === mission.id ? { ...item, status } : item))
    notify(`${mission.name} → ${status}`)
  }

  const toggleSelected = (id: number) => {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }

  const toggleAll = () => {
    setSelected(selected.length === visibleMissions.length ? [] : visibleMissions.map((mission) => mission.id))
  }

  if (loading) {
    return (
      <main className="boot" data-theme={theme}>
        <div className="boot-mark"><span /></div>
        <p>INICIANDO NÚCLEO NEÓN</p>
      </main>
    )
  }

  return (
    <main className="app" data-theme={theme}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><span /></div>
          <div>
            <p>LABORATORIO / 07</p>
            <h1>NEXUS<span>CORE</span></h1>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Cambiar tema">
            {theme === 'dark' ? '◐' : '◑'}
          </button>
          <button className="reset-button" type="button" onClick={reset}>Restaurar</button>
          <button className="new-button" type="button" onClick={addMission}><span>+</span> Nueva misión</button>
        </div>
      </header>

      <section className="stats" aria-label="Resumen de misiones">
        <article><span>Totales</span><strong>{String(counts.total).padStart(2, '0')}</strong><i className="cyan" /></article>
        <article><span>Pendientes</span><strong>{String(counts.pending).padStart(2, '0')}</strong><i className="violet" /></article>
        <article><span>Activas</span><strong>{String(counts.active).padStart(2, '0')}</strong><i className="green" /></article>
        <article><span>Completadas</span><strong>{String(counts.completed).padStart(2, '0')}</strong><i className="pink" /></article>
      </section>

      <div className="workspace">
        <section className="missions-panel">
          <div className="toolbar">
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar misiones" aria-label="Buscar misiones" />
            </label>
            <div className="filters" aria-label="Filtros de estado">
              {(['Todas', 'Pendiente', 'Activa', 'Completada'] as const).map((item) => (
                <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
            <label className="sort">
              <span>Orden</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                <option value="date">Fecha</option>
                <option value="priority">Prioridad</option>
                <option value="name">Nombre</option>
              </select>
            </label>
          </div>

          {selected.length > 0 && (
            <div className="bulk-bar">
              <label><input type="checkbox" checked={selected.length === visibleMissions.length && visibleMissions.length > 0} onChange={toggleAll} /> {selected.length} seleccionadas</label>
              <button type="button" onClick={deleteSelected}>Eliminar selección</button>
            </div>
          )}

          {visibleMissions.length === 0 ? (
            <div className="empty">
              <div>0×0</div>
              <h2>Sin señales</h2>
              <p>No hay misiones que coincidan con esta frecuencia.</p>
              <button type="button" onClick={() => { setSearch(''); setFilter('Todas') }}>Limpiar filtros</button>
            </div>
          ) : (
            <div className="mission-grid">
              {visibleMissions.map((mission) => (
                <article className={`mission-card ${mission.status.toLowerCase()}`} key={mission.id}>
                  <div className="card-head">
                    <label className="check"><input type="checkbox" checked={selected.includes(mission.id)} onChange={() => toggleSelected(mission.id)} aria-label={`Seleccionar ${mission.name}`} /></label>
                    <span className={`priority ${mission.priority.toLowerCase()}`}>{mission.priority}</span>
                    <button className="more" type="button" onClick={() => openEdit(mission)} aria-label={`Editar ${mission.name}`}>•••</button>
                  </div>
                  <p className="category">// {mission.category}</p>
                  <h2>{mission.name}</h2>
                  <div className="card-foot">
                    <span className="status"><i />{mission.status}</span>
                    <div>
                      <button type="button" className="advance" onClick={() => advanceMission(mission)}>{mission.status === 'Completada' ? 'Reabrir' : 'Avanzar'}</button>
                      <button type="button" className="delete" onClick={() => setDeleteTarget(mission)} aria-label={`Eliminar ${mission.name}`}>×</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="activity-panel">
          <div className="activity-head"><div><span /> REGISTRO</div><b>{activity.length.toString().padStart(2, '0')}</b></div>
          <div className="activity-list">
            {activity.length === 0 ? (
              <p className="no-activity">Esperando actividad del núcleo…</p>
            ) : activity.map((item) => (
              <article key={item.id}><i /><div><p>{item.message}</p><time>{new Date(item.time).toLocaleTimeString()}</time></div></article>
            ))}
          </div>
          <div className="system"><span>SISTEMA</span><strong>ESTABLE</strong><i /></div>
        </aside>
      </div>

      {editing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}>
          <form className="modal" onSubmit={updateMission} role="dialog" aria-modal="true" aria-label="Editar misión">
            <div className="modal-head"><div><span>EDICIÓN</span><h2>Configurar misión</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Cerrar">×</button></div>
            <label>Nombre<input required value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label>
            <label>Categoría<select value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <div className="form-row">
              <label>
                Estado
                <select
                  value={editing.status}
                  onChange={(event) => setEditing({ ...editing, status: event.target.value as Status })}
                >
                  <option>Pendiente</option>
                  <option>Activa</option>
                  <option>Completada</option>
                </select>
              </label>
              <label>
                Prioridad
                <select
                  value={editing.priority}
                  onChange={(event) => setEditing({ ...editing, priority: event.target.value as Priority })}
                >
                  <option>Baja</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>
              </label>
            </div>
            <div className="modal-actions"><button type="button" onClick={() => setEditing(null)}>Cancelar</button><button type="submit">Guardar cambios</button></div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="warning">!</div><h2 id="delete-title">Eliminar misión</h2><p>¿Quieres retirar “{deleteTarget.name}” del núcleo?</p>
            <div className="modal-actions"><button type="button" onClick={() => setDeleteTarget(null)}>Cancelar</button><button type="button" className="danger" onClick={deleteMission}>Eliminar</button></div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  )
}

export default App
