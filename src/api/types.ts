/** Les trois statuts possibles d'une tâche (colonnes du tableau). */
export type TaskStatus = 'todo' | 'in_progress' | 'done'

/** Les niveaux de priorité d'une tâche. */
export type Priority = 'low' | 'medium' | 'high'

/** Une tâche du tableau. */
export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assignee: string
  /** Date d'échéance au format ISO « AAAA-MM-JJ ». */
  dueDate: string
}

/** Données saisies dans le formulaire : une tâche sans `id` ni `status` (le Board les ajoute). */
export type NewTask = Omit<Task, 'id' | 'status'>
