import { useEffect, useState } from 'react'

/**
 * Renvoie `value` avec un retard de `delay` ms : la valeur ne change qu'une fois
 * que l'utilisateur a arrêté de taper. Chaque nouvelle frappe annule le minuteur précédent.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
