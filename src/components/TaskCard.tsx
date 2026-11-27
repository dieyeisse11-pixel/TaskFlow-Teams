import type { ChangeEvent } from 'react'
import type { Task, TaskStatus } from '../api/types'
import { STATUSES, isTaskStatus } from '../data/options'
import { formatDate, isOverdue } from '../utils/date'
import PriorityBadge from './PriorityBadge'

interface TaskCardProps {
  task: Task
  onStatusChange: (id: number, status: TaskStatus) => void
  onDelete: (id: number) => void
  /** Désactive les commandes pendant qu'une action est en cours côté serveur. */
  disabled?: boolean
}

export default function TaskCard({ task, onStatusChange, onDelete, disabled = false }: TaskCardProps) {
  const overdue = isOverdue(task)

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (isTaskStatus(value)) {
      onStatusChange(task.id, value)
    }
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description !== '' && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{task.assignee}</span>
        <span aria-hidden="true">·</span>
        <span>Échéance : {formatDate(task.dueDate)}</span>
        {overdue && (
          <span className="rounded-full bg-red-600 px-2 py-0.5 font-medium text-white">
            En retard
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={disabled}
          aria-label={`Statut de la tâche ${task.title}`}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs disabled:opacity-50"
        >
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          disabled={disabled}
          className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </article>
  )
}
