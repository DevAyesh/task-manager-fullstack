export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface TaskFilters {
  search?: string;
  status?: Status;
  priority?: Priority;
  sort?: 'newest' | 'oldest' | 'dueDate';
}

export interface TaskInput {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: string;
}
