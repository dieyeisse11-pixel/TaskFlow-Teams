import type { Priority, TaskStatus } from '../api/types'

/** Statuts avec leur libellé : utilisés par les colonnes et par le menu de changement de statut. */
export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
]

/** Priorités avec leur libellé : utilisées par le formulaire. */
export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
]

/**
 * Gardes de type : `event.target.value` est un `string`, pas un `TaskStatus`.
 * Ces fonctions vérifient la valeur et permettent à TypeScript de la typer sans `as` ni `any`.
 */
export function isTaskStatus(value: string): value is TaskStatus {
  return STATUSES.some((status) => status.value === value)
}

export function isPriority(value: string): value is Priority {
  return PRIORITIES.some((priority) => priority.value === value)
}
