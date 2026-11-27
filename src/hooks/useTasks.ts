import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage, isAbortError } from '../api/http'
import { getTasks } from '../api/tasksApi'
import type { Task } from '../api/types'

/** Tâches reçues, étiquetées avec le projet pour lequel elles ont été demandées. */
interface Loaded {
  projectId: number
  tasks: Task[]
}

/** Résultat (succès ou échec) de la requête identifiée par `key`. */
interface Outcome {
  key: string
  error: string | null
}

export interface UseTasksResult {
  /** Tâches du projet courant. Vide tant que ce projet n'a pas été chargé. */
  tasks: Task[]
  /** Une requête est en cours (premier chargement, changement de projet ou rechargement). */
  loading: boolean
  /** Message d'erreur de la dernière requête, ou `null`. */
  error: string | null
  /** Vrai quand `tasks` contient bien les données du projet courant. */
  ready: boolean
  /** Relance la requête (après une mutation, ou après une erreur). */
  reload: () => void
}

/**
 * Charge les tâches d'un projet depuis l'API.
 *
 * Anti-race-condition : chaque exécution de l'effet crée son propre `AbortController`.
 * Quand `projectId` change (ou qu'on recharge), la fonction de nettoyage annule la requête
 * précédente. Une réponse lente d'un ancien projet ne peut donc jamais écraser la bonne.
 */
export function useTasks(projectId: number): UseTasksResult {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  // Identifie la requête voulue : elle change avec le projet et à chaque rechargement.
  const key = `${projectId}-${reloadCount}`

  useEffect(() => {
    const controller = new AbortController()

    getTasks(projectId, controller.signal)
      .then((tasks) => {
        // Filet de sécurité : si l'effet a été nettoyé entre-temps, on ignore ce résultat.
        if (controller.signal.aborted) return
        setLoaded({ projectId, tasks })
        setOutcome({ key, error: null })
      })
      .catch((err: unknown) => {
        // Une requête annulée n'est pas une erreur : la nouvelle requête prend le relais.
        if (isAbortError(err) || controller.signal.aborted) return
        setOutcome({ key, error: getErrorMessage(err) })
      })

    return () => controller.abort()
  }, [projectId, key])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  // Valeurs DÉRIVÉES (aucun setState synchrone dans l'effet) :
  // - on charge tant qu'aucun résultat n'est arrivé pour la requête courante ;
  // - l'erreur n'est affichée que si elle concerne la requête courante ;
  // - on n'affiche jamais les tâches d'un autre projet pendant le chargement.
  const loading = outcome?.key !== key
  const error = outcome?.key === key ? outcome.error : null
  const ready = loaded !== null && loaded.projectId === projectId
  return { tasks: ready ? loaded.tasks : [], loading, error, ready, reload }
}
