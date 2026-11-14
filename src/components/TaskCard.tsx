import type { Task } from '../api/types'
import { formatDate, isOverdue } from '../utils/date'
import PriorityBadge from './PriorityBadge'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const overdue = isOverdue(task)

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="mt-1 text-sm text-slate-600">{task.description}</p>

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
    </article>
  )
}
