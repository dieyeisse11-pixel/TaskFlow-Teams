interface HeaderProps {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-700">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </header>
  )
}
