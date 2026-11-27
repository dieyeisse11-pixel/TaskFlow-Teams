import { useState } from 'react'
import type { NewTask, TaskStatus } from '../api/types'
import { getErrorMessage } from '../api/http'
import { createTask, deleteTask, updateTaskStatus } from '../api/tasksApi'
import { STATUSES } from '../data/options'
import { useDebounce } from '../hooks/useDebounce'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTasks } from '../hooks/useTasks'
import Column from './Column'
import ErrorState from './ErrorState'
import LoadingState from './LoadingState'
import SearchBar from './SearchBar'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import TaskStats from './TaskStats'

interface BoardProps {
  projectId: number
  projectName: string
}

export default function Board({ projectId, projectName }: BoardProps) {
  // Les tâches ne sont plus dans un useState local : elles viennent de l'API via le hook.
  const { tasks, loading, error, ready, reload } = useTasks(projectId)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Erreur d'une ACTION (création, statut, suppression) : distincte de l'erreur de chargement.
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  /**
   * Exécute une action sur l'API, puis recharge la liste pour afficher l'état réel du serveur.
   * Renvoie `true` si l'action a réussi. En cas d'échec, l'erreur est affichée et la liste n'est pas touchée.
   */
  const runAction = async (action: () => Promise<unknown>): Promise<boolean> => {
    setActionError(null)
    setBusy(true)
    try {
      await action()
      reload()
      return true
    } catch (err) {
      setActionError(getErrorMessage(err))
      return false
    } finally {
      setBusy(false)
    }
  }

  const handleAddTask = (newTask: NewTask) => runAction(() => createTask(projectId, newTask))

  const handleStatusChange = (id: number, status: TaskStatus) => {
    void runAction(() => updateTaskStatus(id, status))
  }

  const handleDeleteTask = (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) return
    void runAction(() => deleteTask(id))
  }

  // --- Valeurs DÉRIVÉES : recalculées à chaque rendu, sans useState ni useEffect ---
  const query = debouncedSearch.trim().toLowerCase()
  const visibleTasks = tasks.filter((task) => task.title.toLowerCase().includes(query))
  const openCount = tasks.filter((task) => task.status !== 'done').length

  let documentTitle = `Chargement… · TaskFlow Teams`
  if (error) documentTitle = `Erreur · TaskFlow Teams`
  else if (ready) documentTitle = `(${openCount}) ${projectName} · TaskFlow Teams`
  useDocumentTitle(documentTitle)

  // L'erreur de chargement prend le dessus ; sinon on attend les premières données.
  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <ErrorState message={error} onRetry={reload} />
      </main>
    )
  }
  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <LoadingState />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {actionError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p>Action impossible : {actionError}</p>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="font-medium underline hover:no-underline"
          >
            Fermer
          </button>
        </div>
      )}

      <TaskStats tasks={tasks} />
      <TaskForm onAddTask={handleAddTask} />
      <SearchBar value={search} onSearchChange={setSearch} />

      <p aria-live="polite" className="h-4 text-xs text-slate-500">
        {loading ? 'Actualisation…' : ''}
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {STATUSES.map(({ value, label }) => {
          const columnTasks = visibleTasks.filter((task) => task.status === value)
          return (
            <Column key={value} title={label} count={columnTasks.length}>
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  disabled={busy}
                />
              ))}
            </Column>
          )
        })}
      </div>
    </main>
  )
}
