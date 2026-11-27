import { useEffect } from 'react'

/** Synchronise le titre de l'onglet du navigateur avec `title` et le restaure au démontage. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
