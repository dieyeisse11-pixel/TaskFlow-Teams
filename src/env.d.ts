/// <reference types="vite/client" />

/** Variables d'environnement lues par Vite : elles doivent commencer par VITE_. */
interface ImportMetaEnv {
  /** Adresse de base de l'API (json-server), par exemple http://localhost:3001. */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
