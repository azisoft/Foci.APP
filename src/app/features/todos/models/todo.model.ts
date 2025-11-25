export interface Todo {
  id: number;
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  createdAt?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
}

export interface UpdateTodoRequest extends CreateTodoRequest {
  id: number;
}

export interface UpdatePartialTodoRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
}
