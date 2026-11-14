import { mockTasks } from './data/mockTasks'
import Board from './components/Board'
import Header from './components/Header'

export default function App() {
  return (
    <>
      <Header title="TaskFlow Teams" subtitle="Le tableau de suivi des tâches de l’équipe" />
      <Board tasks={mockTasks} />
    </>
  )
}
