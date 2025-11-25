import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/api.service';
import { CreateTodoRequest, Todo, UpdatePartialTodoRequest, UpdateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private base = '/todos';

  constructor(private api: ApiService) {}

  getTodos(params?: { title?: string; isCompleted?: boolean }): Promise<Todo[]> {
    return this.api.get<Todo[]>(this.base, params);
  }

  getTodo(id: number): Promise<Todo> {
    return this.api.get<Todo>(`${this.base}/${id}`);
  }

  createTodo(payload: CreateTodoRequest): Promise<Todo> {
    return this.api.post<Todo, CreateTodoRequest>(this.base, payload);
  }

  updateTodo(id: number, payload: UpdateTodoRequest): Promise<void> {
    return this.api.put<void, UpdateTodoRequest>(`${this.base}/${id}`, payload);
  }

  updatePartialTodo(id: number, payload: UpdatePartialTodoRequest): Promise<void> {
    return this.api.patch<void, UpdatePartialTodoRequest>(`${this.base}/${id}`, payload);
  }

  deleteTodo(id: number): Promise<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }

}
