import type { Task } from '../api/types'

/** Date du jour au format « AAAA-MM-JJ » (heure locale). */
export function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Une tâche est en retard si l'échéance est dépassée et qu'elle n'est pas terminée. */
export function isOverdue(task: Task): boolean {
  return task.status !== 'done' && task.dueDate < todayISO()
}

/** Formate « 2026-11-14 » en « 14 nov. 2026 ». */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
