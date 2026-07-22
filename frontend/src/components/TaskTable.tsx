'use client';

import { Task } from '@/types/task';

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-rose-100 text-rose-700',
};

function isOverdue(task: Task) {
  const startOfToday = new Date(new Date().toDateString());
  return task.status !== 'COMPLETED' && new Date(task.dueDate) < startOfToday;
}

export default function TaskTable({ tasks, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading tasks…</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
        <p className="text-sm text-slate-500">No tasks match your filters yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task.id} className={isOverdue(task) ? 'bg-rose-50/40' : undefined}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{task.title}</p>
                {task.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{task.description}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue(task) && (
                  <span className="ml-2 text-xs font-medium text-rose-600">Overdue</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(task)} className="mr-3 text-brand-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => onDelete(task)} className="text-rose-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
