'use client';

import { Status, Priority, TaskFilters } from '@/types/task';

interface Props {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const STATUSES: Status[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

export default function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="search"
        placeholder="Search by title…"
        defaultValue={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:w-auto"
      />

      <select
        value={filters.status || ''}
        onChange={(e) =>
          onChange({ ...filters, status: (e.target.value || undefined) as Status | undefined })
        }
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>

      <select
        value={filters.priority || ''}
        onChange={(e) =>
          onChange({ ...filters, priority: (e.target.value || undefined) as Priority | undefined })
        }
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={filters.sort || 'newest'}
        onChange={(e) => onChange({ ...filters, sort: e.target.value as TaskFilters['sort'] })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="newest">Newest created</option>
        <option value="oldest">Oldest created</option>
        <option value="dueDate">Due date</option>
      </select>
    </div>
  );
}
