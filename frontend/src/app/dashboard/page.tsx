'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Task, DashboardStats as Stats, TaskFilters, TaskInput } from '@/types/task';
import * as api from '@/lib/api';
import DashboardStatsCards from '@/components/DashboardStats';
import FilterBar from '@/components/FilterBar';
import TaskTable from '@/components/TaskTable';
import TaskFormModal from '@/components/TaskFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({ sort: 'newest' });
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchTasks(filters);
      setTasks(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.fetchStats();
      setStats(data);
    } catch {
      // Stats are a nice-to-have on this screen; a failure here shouldn't
      // block the rest of the dashboard from working.
    }
  }, []);

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const timeout = setTimeout(loadTasks, 300);
    return () => clearTimeout(timeout);
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  async function handleFormSubmit(data: TaskInput) {
    if (editingTask) {
      await api.updateTask(editingTask.id, data);
      toast.success('Task updated');
    } else {
      await api.createTask(data);
      toast.success('Task created');
    }
    setEditingTask(null);
    loadTasks();
    loadStats();
  }

  async function handleDeleteConfirm() {
    if (!deletingTask) return;
    try {
      await api.deleteTask(deletingTask.id);
      toast.success('Task deleted');
      loadTasks();
      loadStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setDeletingTask(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <LogoutButton />
      </div>

      {stats && <DashboardStatsCards stats={stats} />}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar filters={filters} onChange={setFilters} />
        <button
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          + New task
        </button>
      </div>

      <div className="mt-4">
        <TaskTable
          tasks={tasks}
          isLoading={isLoading}
          onEdit={(task) => {
            setEditingTask(task);
            setFormOpen(true);
          }}
          onDelete={(task) => setDeletingTask(task)}
        />
      </div>

      <TaskFormModal
        open={formOpen}
        initialTask={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deletingTask}
        title="Delete this task?"
        description={`"${deletingTask?.title}" will be permanently removed.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTask(null)}
      />
    </main>
  );
}
