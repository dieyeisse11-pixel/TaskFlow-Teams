/**
 * Client HTTP générique : c'est le SEUL endroit du projet qui appelle `fetch`.
 * Les composants n'importent jamais ce fichier : ils passent par un hook (useTasks)
 * ou par un module d'API (tasksApi.ts) qui s'appuie sur lui.
 */

/**
 * Erreur levée quand une requête échoue.
 * - `status` vaut le code HTTP (404, 500…) quand le serveur a répondu ;
 * - `status` vaut 0 quand le serveur est injoignable (json-server arrêté, réseau coupé).
 */
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/** Vrai si l'erreur vient d'un `AbortController.abort()` : ce n'est pas une vraie erreur. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Transforme n'importe quelle erreur capturée (`unknown`) en message affichable. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Une erreur inattendue est survenue.'
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: Method
  body?: unknown
  signal?: AbortSignal
}

async function request<T>(path: string, { method = 'GET', body, signal }: RequestOptions = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new Error('VITE_API_URL est absente : crée le fichier .env.local (voir .env.example).')
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    // Une annulation volontaire doit remonter telle quelle (le hook l'ignore).
    if (isAbortError(error)) throw error
    throw new HttpError(0, 'Serveur injoignable. Vérifie que json-server tourne (npm run api).')
  }

  if (!response.ok) {
    throw new HttpError(response.status, `Erreur ${response.status} : ${response.statusText || 'requête refusée'}`)
  }

  // Une réponse peut être vide (ex. 204) : on lit le texte avant de décoder le JSON.
  const text = await response.text()
  // Seul endroit où l'on affirme le type de la réponse : le serveur est supposé respecter son contrat.
  return (text === '' ? undefined : JSON.parse(text)) as T
}

/** Les quatre verbes utilisés par l'application. `T` est le type attendu de la réponse. */
export const http = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
