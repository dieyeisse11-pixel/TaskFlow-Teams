import type { ReactNode } from 'react'

interface ColumnProps {
  title: string
  count: number
  children: ReactNode
}

export default function Column({ title, count, children }: ColumnProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl bg-slate-200/60 p-4">
      <h2 className="flex items-center justify-between font-semibold text-slate-700">
        {title}
        <span className="rounded-full bg-white px-2.5 py-0.5 text-sm text-slate-600">
          {count}
        </span>
      </h2>

      {count === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-400 p-4 text-center text-sm text-slate-500">
          Aucune tâche
        </p>
      ) : (
        children
      )}
    </section>
  )
}
