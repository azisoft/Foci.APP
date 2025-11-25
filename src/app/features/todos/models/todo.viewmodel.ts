export interface TodoViewModel {
  id: number;
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  createdAt?: string;
}

export interface EditTodoViewModel {
  id: number;
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  createdAt?: string;
}