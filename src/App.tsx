import { useState } from 'react'
import Board from './components/Board'
import Header from './components/Header'
import ProjectSelect from './components/ProjectSelect'
import { PROJECTS } from './data/options'

export default function App() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id)
  const project = PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0]

  return (
    <>
      <Header title="TaskFlow Teams" subtitle="Le tableau de suivi des tâches de l’équipe" />
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <ProjectSelect projectId={projectId} onProjectChange={setProjectId} />
      </div>
      <Board projectId={project.id} projectName={project.name} />
    </>
  )
}
