import { getToken } from './auth';
import { Task, DashboardStats, TaskFilters, TaskInput } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Something went wrong');
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export function login(email: string, password: string) {
  return request<{ token: string; user: { id: string; name: string; email: string } }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) }
  );
}

export function fetchTasks(filters: TaskFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.sort) params.set('sort', filters.sort);

  const query = params.toString();
  return request<Task[]>(`/tasks${query ? `?${query}` : ''}`);
}

export function fetchStats() {
  return request<DashboardStats>('/tasks/stats');
}

export function createTask(data: TaskInput) {
  return request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTask(id: string, data: Partial<TaskInput>) {
  return request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteTask(id: string) {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' });
}
