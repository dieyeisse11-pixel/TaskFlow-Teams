import { useState } from 'react'
import type { NewTask, Task, TaskStatus } from '../api/types'
import { mockTasks } from '../data/mockTasks'
import { STATUSES } from '../data/options'
import Column from './Column'
import SearchBar from './SearchBar'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import TaskStats from './TaskStats'

export default function Board() {
  // ÉTAT REMONTÉ : les tâches vivent ici, dans le Board. Les enfants reçoivent des données
  // en props et remontent leurs actions par des callbacks (onXxx).
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [search, setSearch] = useState('')

  // --- Gestionnaires : chacun crée un NOUVEAU tableau (spread, map, filter), sans mutation ---

  const handleAddTask = (newTask: NewTask) => {
    setTasks((prev) => {
      const nextId = prev.reduce((max, task) => Math.max(max, task.id), 0) + 1
      return [...prev, { ...newTask, id: nextId, status: 'todo' }]
    })
  }

  const handleStatusChange = (id: number, status: TaskStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  const handleDeleteTask = (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) return
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // --- Valeur DÉRIVÉE : recalculée à chaque rendu, sans useState ni useEffect ---
  const query = search.trim().toLowerCase()
  const visibleTasks = tasks.filter((task) => task.title.toLowerCase().includes(query))

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <TaskStats tasks={tasks} />
      <TaskForm onAddTask={handleAddTask} />
      <SearchBar value={search} onSearchChange={setSearch} />

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
                />
              ))}
            </Column>
          )
        })}
      </div>
    </main>
  )
}
