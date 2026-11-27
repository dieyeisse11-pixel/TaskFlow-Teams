import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { NewTask, Priority } from '../api/types'
import { PRIORITIES, isPriority } from '../data/options'
import { todayISO } from '../utils/date'

interface TaskFormProps {
  /** Renvoie `true` si la tâche a bien été créée : le formulaire ne se vide alors qu'en cas de succès. */
  onAddTask: (task: NewTask) => Promise<boolean>
}

interface FormValues {
  title: string
  description: string
  priority: Priority
  assignee: string
  dueDate: string
}

interface FormErrors {
  title?: string
  dueDate?: string
}

const INITIAL_VALUES: FormValues = {
  title: '',
  description: '',
  priority: 'medium',
  assignee: '',
  dueDate: '',
}

/** Règles de validation. Les erreurs sont DÉRIVÉES des valeurs : pas d'état séparé. */
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (values.title.trim().length < 3) {
    errors.title = 'Le titre doit contenir au moins 3 caractères.'
  }
  if (values.dueDate === '') {
    errors.dueDate = 'L’échéance est obligatoire.'
  } else if (values.dueDate < todayISO()) {
    errors.dueDate = 'L’échéance ne peut pas être dans le passé.'
  }
  return errors
}

const FIELD =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // useRef : accès direct à l'élément <input> du titre, sans passer par l'état.
  const titleRef = useRef<HTMLInputElement>(null)

  // Focus automatique au premier affichage.
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const errors = validate(values)
  // On n'affiche les erreurs qu'après une première tentative d'envoi.
  const shown: FormErrors = submitted ? errors : {}

  // Un seul gestionnaire pour les champs texte : on copie l'objet avec le spread.
  const handleTextChange =
    (field: 'title' | 'description' | 'assignee' | 'dueDate') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (isPriority(value)) {
      setValues((prev) => ({ ...prev, priority: value }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) {
      // On ramène le curseur sur le titre quand c'est lui qui est invalide.
      if (errors.title) titleRef.current?.focus()
      return
    }

    setSubmitting(true)
    const created = await onAddTask({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      assignee: values.assignee.trim() === '' ? 'Non assigné' : values.assignee.trim(),
      dueDate: values.dueDate,
    })
    setSubmitting(false)

    // En cas d'échec, on garde la saisie pour que l'utilisateur puisse réessayer.
    if (created) {
      setValues(INITIAL_VALUES)
      setSubmitted(false)
      titleRef.current?.focus()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Nouvelle tâche</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Titre *
          </label>
          <input
            id="title"
            ref={titleRef}
            type="text"
            value={values.title}
            onChange={handleTextChange('title')}
            aria-invalid={shown.title !== undefined}
            className={FIELD}
          />
          {shown.title && <p className="mt-1 text-xs text-red-600">{shown.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={2}
            value={values.description}
            onChange={handleTextChange('description')}
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="priority" className="mb-1 block text-sm font-medium">
            Priorité
          </label>
          <select
            id="priority"
            value={values.priority}
            onChange={handlePriorityChange}
            className={FIELD}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium">
            Échéance *
          </label>
          <input
            id="dueDate"
            type="date"
            min={todayISO()}
            value={values.dueDate}
            onChange={handleTextChange('dueDate')}
            aria-invalid={shown.dueDate !== undefined}
            className={FIELD}
          />
          {shown.dueDate && <p className="mt-1 text-xs text-red-600">{shown.dueDate}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="assignee" className="mb-1 block text-sm font-medium">
            Assigné à
          </label>
          <input
            id="assignee"
            type="text"
            value={values.assignee}
            onChange={handleTextChange('assignee')}
            placeholder="Optionnel"
            className={FIELD}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Ajout en cours…' : 'Ajouter la tâche'}
      </button>
    </form>
  )
}
