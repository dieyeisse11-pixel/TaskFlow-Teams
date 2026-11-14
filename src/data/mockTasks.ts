import type { Task } from '../api/types'

/** 8 tâches de démonstration réparties sur les 3 statuts. */
export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Rédiger le cahier des charges',
    description: 'Lister les fonctionnalités attendues du MVP.',
    status: 'todo',
    priority: 'high',
    assignee: 'Awa Diop',
    dueDate: '2026-10-30', // dépassée
  },
  {
    id: 2,
    title: 'Maquetter la page d’accueil',
    description: 'Créer la maquette sur Figma.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Moussa Ndiaye',
    dueDate: '2027-01-15',
  },
  {
    id: 3,
    title: 'Configurer l’intégration continue',
    description: 'Lancer le build et les tests à chaque push.',
    status: 'todo',
    priority: 'low',
    assignee: 'Fatou Sow',
    dueDate: '2027-02-01',
  },
  {
    id: 4,
    title: 'Développer l’API des tâches',
    description: 'Routes GET, POST, PUT et DELETE.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Ibrahima Fall',
    dueDate: '2026-11-05', // dépassée
  },
  {
    id: 5,
    title: 'Créer le composant TaskCard',
    description: 'Afficher titre, priorité et échéance.',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Awa Diop',
    dueDate: '2026-12-10',
  },
  {
    id: 6,
    title: 'Rédiger les tests unitaires',
    description: 'Couvrir les fonctions utilitaires.',
    status: 'in_progress',
    priority: 'low',
    assignee: 'Moussa Ndiaye',
    dueDate: '2026-11-14',
  },
  {
    id: 7,
    title: 'Installer le projet Vite',
    description: 'Template react-ts avec Tailwind v4.',
    status: 'done',
    priority: 'medium',
    assignee: 'Fatou Sow',
    dueDate: '2026-10-20', // passée mais terminée : pas de badge
  },
  {
    id: 8,
    title: 'Choisir la palette de couleurs',
    description: 'Valider les couleurs avec l’équipe.',
    status: 'done',
    priority: 'low',
    assignee: 'Ibrahima Fall',
    dueDate: '2026-11-01', // passée mais terminée : pas de badge
  },
]
