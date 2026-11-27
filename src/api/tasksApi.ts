import { http } from './http'
import type { NewTask, Task, TaskStatus } from './types'

/** Lit les tâches d'un projet. Le `signal` permet d'annuler la requête (voir useTasks). */
export function getTasks(projectId: number, signal?: AbortSignal): Promise<Task[]> {
  return http.get<Task[]>(`/tasks?projectId=${projectId}`, signal)
}

/** Crée une tâche « À faire » dans le projet. L'`id` est attribué par le serveur. */
export function createTask(projectId: number, newTask: NewTask): Promise<Task> {
  const payload = { ...newTask, projectId, status: 'todo' } satisfies Omit<Task, 'id'>
  return http.post<Task>('/tasks', payload)
}

/** Change uniquement le statut (PATCH modifie un champ, PUT remplacerait toute la tâche). */
export function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  return http.patch<Task>(`/tasks/${id}`, { status })
}

export function deleteTask(id: number): Promise<void> {
  return http.delete(`/tasks/${id}`)
}
