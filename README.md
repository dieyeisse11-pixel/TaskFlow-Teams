# TaskFlow Teams — Séances 1 à 3

Tableau de suivi de tâches (style Kanban) en **React + TypeScript + Tailwind CSS v4**, construit avec **Vite**.

- **Séance 1** : maquette statique typée (composants de base, sans état).
- **Séance 2** : board interactif avec un état local immuable (formulaire, statuts, suppression, statistiques, recherche).
  Voir la section « Séance 2 » plus bas.
- **Séance 3** : les données viennent d'une vraie API (**json-server**) au lieu de `mockTasks`. Chargement, erreurs, annulation
  des requêtes, hooks personnalisés. Voir la section « Séance 3 » plus bas.

## Lancer le projet

```bash
npm install
npm run dev:all  # lance l'API (http://localhost:3001) ET le site (http://localhost:5173)
```

Autres commandes :

```bash
npm run api        # json-server seul (port 3001)
npm run api:slow   # json-server avec 1,5 s de délai : pratique pour tester le chargement et les race conditions
npm run dev        # Vite seul
npm run build      # vérification TypeScript + build de production
npm run lint       # oxlint
```

> **Première fois :** vérifie que le fichier `.env.local` existe à la racine (il contient `VITE_API_URL=http://localhost:3001`).
> S'il manque, copie `.env.example` vers `.env.local`. Il est ignoré par Git, d'où ce modèle.

## Capture d'écran

> **À faire :** lance `npm run dev`, ouvre la page, fais une capture d'écran, enregistre-la dans `docs/capture.png`.
> Pour la séance 2, enregistre une deuxième capture dans `docs/capture-seance2.png`. Elles s'afficheront ci-dessous.

![Capture d'écran de TaskFlow Teams](docs/capture.png)

![Capture d'écran séance 2](docs/capture-seance2.png)

## Structure du projet

```
db.json                   # Base de données de json-server (12 tâches, 2 projets)   [séance 3]
.env.local                # VITE_API_URL (ignoré par Git) ; modèle : .env.example     [séance 3]
src/
├── env.d.ts              # Types des variables d'environnement Vite                  [séance 3]
├── api/
│   ├── types.ts          # Types : Task, TaskStatus, Priority, Project
│   ├── http.ts           # Client fetch générique + HttpError (seul fichier avec fetch) [séance 3]
│   └── tasksApi.ts       # getTasks, createTask, updateTaskStatus, deleteTask          [séance 3]
├── hooks/                                                                              [séance 3]
│   ├── useTasks.ts       # Chargement, erreur, reload(), annulation (AbortController)
│   ├── useDebounce.ts    # Retarde une valeur (recherche)
│   └── useDocumentTitle.ts  # Titre de l'onglet du navigateur
├── data/
│   └── options.ts        # Statuts, priorités, projets et gardes de type
├── utils/
│   └── date.ts           # todayISO(), isOverdue(), formatDate()
├── components/
│   ├── Header.tsx        # Titre de l'application
│   ├── Board.tsx         # Tâches via useTasks + actions API + les 3 colonnes
│   ├── Column.tsx        # Une colonne (titre, compteur, children)
│   ├── TaskCard.tsx      # Une carte (+ changement de statut, suppression)
│   ├── PriorityBadge.tsx # Pastille de priorité
│   ├── TaskForm.tsx      # Formulaire contrôlé avec validation    [séance 2]
│   ├── TaskStats.tsx     # Total, terminées, avancement, retard   [séance 2]
│   ├── SearchBar.tsx     # Recherche par titre                    [séance 2]
│   ├── ProjectSelect.tsx # Choix du projet affiché                [séance 3]
│   ├── LoadingState.tsx  # Indicateur de chargement               [séance 3]
│   └── ErrorState.tsx    # Message d'erreur + bouton « Réessayer » [séance 3]
├── App.tsx               # Header + choix du projet + Board
├── main.tsx              # Point d'entrée
└── index.css             # Import de Tailwind
```

## Explications

### 1. Le projet et Tailwind v4
- Créé avec `npm create vite@latest TaskFlow-Teams -- --template react-ts`.
- Tailwind v4 s'installe avec `npm install tailwindcss @tailwindcss/vite`.
  Il n'y a **plus** de `tailwind.config.js` : on ajoute le plugin `tailwindcss()` dans `vite.config.ts`
  et la ligne `@import "tailwindcss";` dans `src/index.css`.

### 2. Les types (`src/api/types.ts`)
- `TaskStatus` et `Priority` sont des **unions de chaînes** (`'todo' | 'in_progress' | 'done'`).
  TypeScript refuse alors toute autre valeur (par exemple `'fini'`), ce qui évite les fautes de frappe.
- `Task` est une **interface** qui décrit tous les champs d'une tâche.
  `dueDate` est une chaîne ISO `AAAA-MM-JJ`, facile à comparer.
- Aucun `any` n'est utilisé dans le projet.

### 3. Les données (`src/data/mockTasks.ts`, supprimé en séance 3 : les tâches sont maintenant dans `db.json`)
Un tableau `Task[]` de 8 tâches : **3 « À faire », 3 « En cours », 2 « Terminé »**.
Certaines ont une date passée pour tester le badge « En retard » (y compris deux tâches terminées
en retard, qui ne doivent **pas** avoir le badge).

### 4. Les composants

| Composant | Rôle | Props (interface) |
|---|---|---|
| `Header` | Affiche le titre et le sous-titre | `HeaderProps { title, subtitle }` |
| `Board` | Pour chaque statut, **filtre** les tâches et crée une `Column` | `BoardProps { tasks }` |
| `Column` | Affiche le titre, le **compteur**, et « Aucune tâche » si vide. Reçoit les cartes via **`children`** | `ColumnProps { title, count, children }` |
| `TaskCard` | Affiche titre, description, assigné, échéance, badges | `TaskCardProps { task }` |
| `PriorityBadge` | Pastille colorée (Basse / Moyenne / Haute) | `PriorityBadgeProps { priority }` |

Points clés :
- **Props typées par interface** : chaque composant déclare son `interface XxxProps`.
- **`key={task.id}`** : dans `.map()`, React a besoin d'une clé unique et stable. On utilise l'`id`, jamais l'index.
- **`children`** : `Column` ne sait pas ce qu'elle contient. `Board` lui passe les `TaskCard` entre ses balises, de type `ReactNode`.
- **Filtrer par statut** : `tasks.filter((task) => task.status === status)` dans `Board`.
- **`Record<Priority, ...>`** dans `PriorityBadge` : TypeScript vérifie qu'on a bien prévu un style pour chaque priorité.

### 5. Le badge « En retard » (`src/utils/date.ts`)
```ts
export function isOverdue(task: Task): boolean {
  return task.status !== 'done' && task.dueDate < todayISO()
}
```
Une tâche est en retard si elle n'est **pas terminée** et que son échéance est **avant aujourd'hui**.
Comme les dates sont au format `AAAA-MM-JJ`, la comparaison de chaînes fonctionne correctement.
`TaskCard` affiche le badge seulement si `isOverdue(task)` est vrai.

## Séance 2 — Board interactif local

### Les 5 objectifs et où les trouver

| Objectif | Où dans le code |
|---|---|
| 1. Tâches dans un `useState` du Board (état remonté) | `Board.tsx` : `useState<Task[]>(mockTasks)` (en séance 3, les tâches viennent de `useTasks`) |
| 2. `TaskForm` contrôlé (titre ≥ 3 caractères, priorité, description, échéance non passée) | `TaskForm.tsx` |
| 3. Changement de statut et suppression après confirmation | `TaskCard.tsx` (menu et bouton) + `handleStatusChange` et `handleDeleteTask` dans `Board.tsx` |
| 4. `TaskStats` : total, terminées, % d'avancement, en retard | `TaskStats.tsx` |
| 5. Recherche par titre, insensible à la casse | `SearchBar.tsx` + `visibleTasks` dans `Board.tsx` |

### Notions à comprendre

**État remonté (lifting state up).** Les tâches sont utilisées par plusieurs composants (colonnes, statistiques, formulaire).
On les place donc dans leur plus proche parent commun, le `Board`. Les enfants reçoivent des données par les props et
« remontent » leurs actions par des callbacks. Ainsi, il n'y a qu'une seule source de vérité.

**Immutabilité : aucune mutation d'état.** React ne détecte un changement que si on lui donne un **nouvel** objet ou tableau.
On n'utilise donc jamais `push`, `splice` ni `tasks[0].status = ...`, seulement `map`, `filter` et le spread `...` :

```ts
// Ajouter
setTasks((prev) => [...prev, { ...newTask, id: nextId, status: 'todo' }])
// Modifier : on copie seulement la tâche concernée
setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))
// Supprimer
setTasks((prev) => prev.filter((task) => task.id !== id))
```

**Valeurs dérivées : ni `useState` ni `useEffect`.** Ce qui peut se calculer à partir de l'état ne doit pas être stocké dans un
deuxième état (il risquerait d'être désynchronisé). On le recalcule à chaque rendu :
- la liste filtrée : `tasks.filter((t) => t.title.toLowerCase().includes(query))` ;
- les statistiques, dans `TaskStats` : `done`, `overdue` et `progress` sont de simples constantes ;
- les erreurs du formulaire : la fonction `validate(values)` les calcule depuis les valeurs saisies.

Il y a quand même des `useState` pour ce qui est **saisi** par l'utilisateur : le texte de la recherche, les champs du
formulaire. Ce ne sont pas des valeurs dérivées.

**Formulaire contrôlé.** Chaque champ a `value={...}` et `onChange={...}` : c'est React qui possède la valeur, pas le navigateur.
Les erreurs s'affichent après une première tentative d'envoi.

**Callbacks nommés `onXxx`.** Les *props* qui reçoivent une fonction s'appellent `onAddTask`, `onStatusChange`, `onDelete`,
`onSearchChange`. Les fonctions définies dans le composant s'appellent `handleXxx`.

**Gardes de type (`isTaskStatus`, `isPriority`).** `event.target.value` est un `string`. Pour le convertir en `TaskStatus`
sans `any` ni `as`, on vérifie d'abord sa valeur avec une fonction `value is TaskStatus`.

**Confirmation de suppression.** `window.confirm(...)` ouvre une fenêtre Oui/Non. Si on clique sur Annuler, la fonction s'arrête
avec `return` et rien n'est supprimé.

### Critères de validation (séance 2)

- [x] Aucune mutation d'état (`map`, `filter`, spread uniquement)
- [x] Statistiques et liste filtrée dérivées (aucun `useState` ni `useEffect` pour elles)
- [x] Callbacks nommés `onXxx`
- [x] `npm run build` sans erreur, aucun `any`
- [ ] Capture d'écran de la séance 2 (à ajouter : `docs/capture-seance2.png`)

### Test rapide à faire à la main

1. Clique sur « Ajouter la tâche » sans rien remplir : deux messages d'erreur apparaissent.
2. Saisis un titre de 2 lettres, ou une date passée : les erreurs restent.
3. Saisis un titre valide et une date future : la tâche arrive dans « À faire » et le total monte.
4. Change son statut avec le menu de la carte : le compteur « Terminées » et le pourcentage changent.
5. Tape `VITE` dans la recherche : seule la tâche « Installer le projet Vite » reste (la casse est ignorée).
6. Clique sur « Supprimer », puis Annuler : rien ne change. Recommence et confirme : la tâche disparaît.

> Les échéances des tâches de démonstration sont des dates fixes. Au fil du temps, de plus en plus de tâches passent « en retard » :
> c'est normal.

## Séance 3 — Branchement sur l'API

Les tâches ne sont plus dans `mockTasks.ts` (supprimé) mais dans `db.json`, servi par **json-server** sur `http://localhost:3001`.

### Les 5 objectifs et où les trouver

| Objectif | Où dans le code |
|---|---|
| 1. Scripts `api` et `dev:all`, `.env.local`, `src/env.d.ts` | `package.json`, `.env.local`, `src/env.d.ts` |
| 2. Client générique, `HttpError`, API des tâches | `src/api/http.ts`, `src/api/tasksApi.ts` |
| 3. `useTasks(projectId)` : chargement, erreur, `reload()`, annulation | `src/hooks/useTasks.ts` |
| 4. Création, statut, suppression via l'API puis rechargement | `runAction` dans `Board.tsx` |
| 5. `useDocumentTitle`, `useDebounce`, focus avec `useRef` | `src/hooks/`, `Board.tsx`, `TaskForm.tsx` |

### Notions à comprendre

**Un seul endroit pour `fetch`.** `src/api/http.ts` est le seul fichier qui appelle `fetch`. Il ajoute l'adresse de base
(`import.meta.env.VITE_API_URL`), envoie le JSON, vérifie `response.ok` et lève une **`HttpError`** (avec le code `status`) si le
serveur répond 404 ou 500. Si le serveur est arrêté, `fetch` lève une `TypeError` : on la transforme en `HttpError` de statut `0`
avec un message lisible. Les composants n'appellent jamais `fetch` : ils passent par un hook ou par `tasksApi.ts`.

**Variables d'environnement Vite.** Seules les variables qui commencent par `VITE_` sont visibles dans le navigateur.
`src/env.d.ts` déclare leur type : sans lui, `import.meta.env.VITE_API_URL` ne serait pas typé. Après avoir modifié `.env.local`,
il faut **redémarrer** `npm run dev`.

**Les verbes HTTP.** `GET /tasks?projectId=1` lit, `POST /tasks` crée, `PATCH /tasks/3` modifie **un champ** (ici le statut),
`DELETE /tasks/3` supprime. `PUT` aurait remplacé toute la tâche.

**`useTasks(projectId)` et la race condition.** Imagine que tu passes du projet 1 au projet 2 pendant que la requête du
projet 1 est lente. Si on ne fait rien, la réponse du projet 1 peut arriver **après** celle du projet 2 et l'écraser : l'écran
affiche alors les mauvaises tâches. La parade est un `AbortController` créé à chaque exécution de l'effet :

```ts
useEffect(() => {
  const controller = new AbortController()
  getTasks(projectId, controller.signal).then(...).catch(...)
  return () => controller.abort()   // nettoyage : annule la requête devenue obsolète
}, [projectId, key])
```

Une requête annulée lève une `AbortError` : ce n'est pas une vraie erreur, on l'ignore (`isAbortError`).
Il y a une seconde protection : les tâches reçues sont étiquetées avec leur `projectId`, et le hook ne rend jamais celles d'un autre projet.

**Valeurs dérivées dans le hook.** `loading`, `error` et `ready` sont **calculés** à partir de l'état, sans `setState` synchrone
dans l'effet (l'analyseur de code le signale). La clé `projectId-reloadCount` identifie la requête voulue : tant qu'aucun résultat
n'est arrivé pour cette clé, on est en chargement.

**Chargement, erreur et actualisation.** Trois cas dans `Board` :
- **Erreur de chargement** : `ErrorState` avec un bouton « Réessayer » qui appelle `reload()`.
- **Premier chargement** (ou changement de projet) : `LoadingState`.
- **Rechargement** après une action : les tâches restent affichées et « Actualisation… » apparaît discrètement.

**Actions puis rechargement.** `runAction` exécute l'appel API, puis appelle `reload()` : on affiche **l'état réel du serveur**
au lieu de deviner. Si l'action échoue, un bandeau « Action impossible » s'affiche (distinct de l'erreur de chargement) et le
formulaire **conserve la saisie**. Pendant l'action, les commandes des cartes sont désactivées (`busy`).

**`useDocumentTitle`.** Synchronise `document.title` avec l'état de l'application (par exemple « (5) TaskFlow Teams · TaskFlow Teams »,
avec le nombre de tâches non terminées) et restaure l'ancien titre au démontage.

**`useDebounce`.** Le champ de recherche reste réactif (il affiche chaque lettre), mais le filtre n'utilise que la valeur
**débouncée** : il attend 300 ms après la dernière frappe. Chaque frappe relance le minuteur.

**`useRef` et le focus.** `useRef<HTMLInputElement>(null)` donne un accès direct à l'`<input>` du titre. Il reçoit le focus au
premier affichage, après une création réussie (pour enchaîner), et quand le titre est invalide.

### Critères de validation (séance 3)

- [x] Aucun `fetch` dans un composant (un seul `fetch`, dans `src/api/http.ts`)
- [x] Chargement et erreur visibles (voir le test ci-dessous)
- [x] Pas de requête obsolète qui écrase la bonne (`AbortController` + étiquette `projectId`)
- [x] `npm run build` sans erreur, `npm run lint` sans avertissement, aucun `any`
- [ ] Capture d'écran de la séance 3 (à ajouter : `docs/capture-seance3.png`)

### Tests à faire à la main

1. **Chargement** : lance `npm run api:slow` puis `npm run dev`. Recharge la page : « Chargement des tâches… » s'affiche 1,5 s.
2. **Erreur** : arrête json-server (`Ctrl+C` dans son terminal) puis recharge la page. Le message « Serveur injoignable… » et le
   bouton « Réessayer » apparaissent. Relance `npm run api:slow`, clique sur « Réessayer » : le tableau revient.
3. **Race condition** : avec `api:slow`, change de projet **très vite** (Site vitrine, puis TaskFlow Teams, puis Site vitrine).
   Ouvre l'onglet « Réseau » des outils du navigateur : les requêtes intermédiaires sont **annulées** (« canceled »).
   À la fin, c'est toujours le dernier projet choisi qui est affiché.
4. **Création** : l'onglet affiche le focus sur « Titre ». Ajoute une tâche : elle apparaît après le rechargement, et le focus revient sur « Titre ».
   Regarde `db.json` : la tâche y est écrite.
5. **Statut et suppression** : change un statut, puis supprime une tâche (avec confirmation) : les compteurs et le titre de l'onglet suivent.
6. **Recherche** : tape vite `vite` : le filtre ne s'applique qu'environ 300 ms après la dernière lettre.
7. **Erreur d'action** : arrête json-server **après** le chargement, puis ajoute une tâche : le bandeau « Action impossible » s'affiche et ta saisie est conservée.

> `db.json` est **modifié** par json-server à chaque création, changement de statut ou suppression. Pour repartir des données
> d'origine : `git checkout db.json` (ou remets les 12 tâches à la main).

## Premier commit poussé

```bash
git init
git add .
git commit -m "feat: maquette statique typée (séance 1)"
# Pour la séance 2 : git add . puis git commit -m "feat: board interactif (séance 2)" puis git push
# Pour la séance 3 : git add . puis git commit -m "feat: branchement sur l'API json-server (séance 3)" puis git push
git branch -M main
git remote add origin https://github.com/<ton-compte>/TaskFlow-Teams.git
git push -u origin main
```
Crée d'abord un dépôt vide sur GitHub, puis remplace `<ton-compte>` par ton nom d'utilisateur.
Le fichier `.gitignore` exclut déjà `node_modules` et `dist`.

## Critères de validation

- [x] `npm run build` sans erreur, aucun `any`
- [x] Props typées par interface, `key = id`
- [ ] Capture d'écran dans le README (à ajouter : `docs/capture.png`)
