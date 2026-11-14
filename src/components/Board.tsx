import type { Task, TaskStatus } from '../api/types'
import Column from './Column'
import TaskCard from './TaskCard'

interface BoardProps {
  tasks: Task[]
}

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'À faire' },
  { status: 'in_progress', title: 'En cours' },
  { status: 'done', title: 'Terminé' },
]

export default function Board({ tasks }: BoardProps) {
  return (
    //  on  parcourt  les  elts  du  tableau  
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">
      {COLUMNS.map(({ status, title }) => {
        const columnTasks = tasks.filter((task) => task.status === status)
        return (
          <Column key={status} title={title} count={columnTasks.length}>
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Column>
        )
      })}
    </main>
  )
}
