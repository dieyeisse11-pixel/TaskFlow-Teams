# TaskFlow Teams — Séance 1 : Maquette statique typée

Tableau de suivi de tâches (style Kanban) en **React + TypeScript + Tailwind CSS v4**, construit avec **Vite**.
Cette séance pose le projet et les composants de base, **sans état** (pas de `useState`, pas d'appel réseau).

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vérification TypeScript + build de production
```

## Capture d'écran

> **À faire :** lance `npm run dev`, ouvre la page, fais une capture d'écran, enregistre-la dans `docs/capture.png`.
> Elle s'affichera ci-dessous.

![Capture d'écran de TaskFlow Teams](docs/capture.png)

## Structure du projet

```
src/
├── api/
│   └── types.ts          # Types : Task, TaskStatus, Priority
├── data/
│   └── mockTasks.ts      # 8 tâches de démonstration
├── utils/
│   └── date.ts           # isOverdue() et formatDate()
├── components/
│   ├── Header.tsx        # Titre de l'application
│   ├── Board.tsx         # Les 3 colonnes, filtre les tâches par statut
│   ├── Column.tsx        # Une colonne (titre, compteur, children)
│   ├── TaskCard.tsx      # Une carte de tâche
│   └── PriorityBadge.tsx # Pastille de priorité
├── App.tsx               # Assemble Header + Board
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

## Premier commit poussé

```bash
git init
git add .
git commit -m "feat: maquette statique typée (séance 1)"
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
