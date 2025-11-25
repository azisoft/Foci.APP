import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoApiService } from '../../services/todos-api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mapToTodoViewModel } from '../../../utils/model-mapper';
import { TodoViewModel } from '../../models/todo.viewmodel';

// ...existing code...
@Component({
  selector: 'foci-todos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit, OnDestroy {

  public todos: TodoViewModel[] = [];

  public loading = false;
  public error?: string;

  // filter state
  public title?: string | null = null;
  public isCompleted?: boolean | null = null; // null = All, true = Completed, false = Not Completed
  private title$ = new Subject<string>();   // debounced search

  constructor(private todoApi: TodoApiService) {
    // debounced title
    this.title$
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((val) => {
        this.title = val || null;
        this.onFilterChange();
      });

  }

  async ngOnInit(): Promise<void> {
    await this.loadTodos();
  }

  ngOnDestroy(): void {
    this.title$.complete();
  }

  private async loadTodos(): Promise<void> {
    this.loading = true;
    this.error = undefined;

    const params: {
      title?: string;
      isCompleted?: boolean;
    } = {};

    if (this.title) params.title = this.title;
    if (this.isCompleted !== null && this.isCompleted !== undefined) params.isCompleted = this.isCompleted;

    try {
      const result = await this.todoApi.getTodos(params);
      this.todos = result.map(todo => mapToTodoViewModel(todo));
    } catch (err) {
      this.error = 'Failed to load todos';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  public onFilterChange(): Promise<void> {
    return this.loadTodos();
  }

  // called from template for title input to debounce requests
  public onTitleInput(value: string | null): void {
    console.log(value);
    this.title$.next(value ?? '');
  }

  public onCompletedInput(): void {
    if (this.isCompleted === null) {
      this.isCompleted = true;
    } else if (this.isCompleted === true) {
      this.isCompleted = false;
    } else {
      this.isCompleted = null;
    }
    this.onFilterChange();
  }

  public async deleteTodo(todoId: number): Promise<void> {
    try {
      await this.todoApi.deleteTodo(todoId);
      await this.loadTodos();
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  }

  public async confirmDelete(todoId: number): Promise<void> {
    if (!confirm('Delete this todo?')) {
      return;
    }
    await this.deleteTodo(todoId);
  }

  public async toggleCompleted(todo: TodoViewModel): Promise<void> {
    try {
      await this.todoApi.updatePartialTodo(todo.id, { isCompleted: !todo.isCompleted });
      await this.loadTodos();
    } catch (err) {
      console.error('Failed to set completed status', err);
    }
  }
}