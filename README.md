# TaskFlow Teams — Séances 1 et 2

Tableau de suivi de tâches (style Kanban) en **React + TypeScript + Tailwind CSS v4**, construit avec **Vite**.

- **Séance 1** : maquette statique typée (composants de base, sans état).
- **Séance 2** : board interactif avec un état local immuable (formulaire, statuts, suppression, statistiques, recherche).
  Voir la section « Séance 2 » plus bas.

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vérification TypeScript + build de production
```

## Capture d'écran

> **À faire :** lance `npm run dev`, ouvre la page, fais une capture d'écran, enregistre-la dans `docs/capture.png`.
> Pour la séance 2, enregistre une deuxième capture dans `docs/capture-seance2.png`. Elles s'afficheront ci-dessous.

![Capture d'écran de TaskFlow Teams](docs/capture.png)

![Capture d'écran séance 2](docs/capture-seance2.png)

## Structure du projet

```
src/
├── api/
│   └── types.ts          # Types : Task, TaskStatus, Priority
├── data/
│   ├── mockTasks.ts      # 8 tâches de démonstration (état initial)
│   └── options.ts        # Statuts, priorités et gardes de type   [séance 2]
├── utils/
│   └── date.ts           # todayISO(), isOverdue(), formatDate()
├── components/
│   ├── Header.tsx        # Titre de l'application
│   ├── Board.tsx         # ÉTAT des tâches (useState) + les 3 colonnes
│   ├── Column.tsx        # Une colonne (titre, compteur, children)
│   ├── TaskCard.tsx      # Une carte (+ changement de statut, suppression)
│   ├── PriorityBadge.tsx # Pastille de priorité
│   ├── TaskForm.tsx      # Formulaire contrôlé avec validation    [séance 2]
│   ├── TaskStats.tsx     # Total, terminées, avancement, retard   [séance 2]
│   └── SearchBar.tsx     # Recherche par titre                    [séance 2]
├── App.tsx               # Assemble Header + Board (Board ne reçoit plus de props)
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

### 3. Les données (`src/data/mockTasks.ts`)
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
| 1. Tâches dans un `useState` du Board (état remonté) | `Board.tsx` : `useState<Task[]>(mockTasks)` |
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

## Premier commit poussé

```bash
git init
git add .
git commit -m "feat: maquette statique typée (séance 1)"
# Pour la séance 2 : git add . puis git commit -m "feat: board interactif (séance 2)" puis git push
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
