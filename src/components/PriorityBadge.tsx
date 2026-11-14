import type { Priority } from '../api/types'

interface PriorityBadgeProps {
  priority: Priority
}

const STYLES: Record<Priority, { label: string; classes: string }> = {
  low: { label: 'Basse', classes: 'bg-emerald-100 text-emerald-800' },
  medium: { label: 'Moyenne', classes: 'bg-amber-100 text-amber-800' },
  high: { label: 'Haute', classes: 'bg-rose-100 text-rose-800' },
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, classes } = STYLES[priority]
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
