interface ErrorStateProps {
  message: string
  onRetry: () => void
}

/** Affiché quand le chargement échoue (par exemple si json-server est arrêté). */
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
      <p className="font-semibold">Impossible de charger les tâches</p>
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>
  )
}
