/** Les trois statuts possibles d'une tâche (colonnes du tableau). */
export type TaskStatus = 'todo' | 'in_progress' | 'done'

/** Les niveaux de priorité d'une tâche. */
export type Priority = 'low' | 'medium' | 'high'

/** Une tâche du tableau, telle que renvoyée par l'API. */
export interface Task {
  id: number
  /** Projet auquel appartient la tâche (clé étrangère utilisée par `GET /tasks?projectId=…`). */
  projectId: number
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assignee: string
  /** Date d'échéance au format ISO « AAAA-MM-JJ ». */
  dueDate: string
}

/** Un projet : liste de choix du sélecteur de projet. */
export interface Project {
  id: number
  name: string
}

/**
 * Données saisies dans le formulaire : une tâche sans `id`, `status` ni `projectId`.
 * Le statut initial et le projet sont ajoutés par `createTask` (api/tasksApi.ts).
 */
export type NewTask = Omit<Task, 'id' | 'status' | 'projectId'>
