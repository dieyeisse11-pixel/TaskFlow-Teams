import type { Task } from '../api/types'
import { isOverdue } from '../utils/date'

interface TaskStatsProps {
  tasks: Task[]
}

interface StatItemProps {
  label: string
  value: string | number
  accent?: string
}

function StatItem({ label, value, accent = 'text-slate-900' }: StatItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  )
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  // Tout est DÉRIVÉ de `tasks` à chaque rendu : ni useState ni useEffect.
  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'done').length
  const overdue = tasks.filter(isOverdue).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <section aria-label="Statistiques" className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatItem label="Total" value={total} />
        <StatItem label="Terminées" value={done} accent="text-emerald-600" />
        <StatItem label="Avancement" value={`${progress} %`} accent="text-indigo-600" />
        <StatItem label="En retard" value={overdue} accent="text-red-600" />
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-2 overflow-hidden rounded-full bg-slate-200"
      >
        <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </section>
  )
}
