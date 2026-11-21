interface SearchBarProps {
  value: string
  onSearchChange: (value: string) => void
}

export default function SearchBar({ value, onSearchChange }: SearchBarProps) {
  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Rechercher une tâche par titre
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher une tâche par titre…"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  )
}
