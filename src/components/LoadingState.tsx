interface LoadingStateProps {
  message?: string
}

/** Affiché pendant le premier chargement des tâches. */
export default function LoadingState({ message = 'Chargement des tâches…' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-slate-600 shadow-sm"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"
      />
      {message}
    </div>
  )
}
