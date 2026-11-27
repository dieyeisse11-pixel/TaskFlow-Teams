import type { ChangeEvent } from 'react'
import { PROJECTS } from '../data/options'

interface ProjectSelectProps {
  projectId: number
  onProjectChange: (projectId: number) => void
}

export default function ProjectSelect({ projectId, onProjectChange }: ProjectSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // `value` est un string : on retrouve le projet correspondant plutôt que de convertir à l'aveugle.
    const project = PROJECTS.find((p) => String(p.id) === event.target.value)
    if (project) onProjectChange(project.id)
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="project" className="text-sm font-medium text-slate-700">
        Projet
      </label>
      <select
        id="project"
        value={projectId}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      >
        {PROJECTS.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  )
}
