import { DashboardStats as Stats } from '@/types/task';

const CARDS: { key: keyof Stats; label: string; accent: string }[] = [
  { key: 'total', label: 'Total Tasks', accent: 'bg-slate-100 text-slate-700' },
  { key: 'pending', label: 'Pending', accent: 'bg-amber-100 text-amber-700' },
  { key: 'inProgress', label: 'In Progress', accent: 'bg-blue-100 text-blue-700' },
  { key: 'completed', label: 'Completed', accent: 'bg-emerald-100 text-emerald-700' },
  { key: 'overdue', label: 'Overdue', accent: 'bg-rose-100 text-rose-700' },
];

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CARDS.map((card) => (
        <div key={card.key} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {card.label}
          </p>
          <p className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-2xl font-semibold ${card.accent}`}>
            {stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
