import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../../models/todo.model';
import { TodoApiService } from '../../../services/todos-api.service';
import { EditTodoViewModel } from '../../../models/todo.viewmodel';
import { mapToEditTodoViewModel } from '../../../../utils/model-mapper';

@Component({
  selector: 'foci-todo',
  imports: [FormsModule, RouterModule],
  templateUrl: './edit-todos.component.html',
  styleUrls: ['./edit-todos.component.css'],
  standalone: true
})
export class EdiTodoComponent implements OnInit {
  id?: number;

  public model: Partial<EditTodoViewModel> = {
    id: 0,
    title: '',
    description: '',
    dueDate: undefined,
    isCompleted: false,
  };

  public loading = false;
  public saving = false;
  public error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoApi: TodoApiService
  ) {
    const idStr = this.route.snapshot.paramMap.get('id');
    this.id = idStr ? Number(idStr) : undefined;
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      if (this.id != null && !Number.isNaN(this.id)) {
        const g = await this.todoApi.getTodo(this.id);
        this.model = mapToEditTodoViewModel(g);
      }
    } catch (err) {
      console.error(err);
      this.error = 'Failed to load todos.';
    } finally {
      this.loading = false;
    }
  }

  public async save(): Promise<void> {
    this.saving = true;
    this.error = undefined;

    try {
      if (this.id != null && !Number.isNaN(this.id)) {
        await this.todoApi.updateTodo(this.id, this.model as Todo);
      } else {
        const created = await this.todoApi.createTodo(this.model as Todo);
      }
      await this.router.navigate(['/todos']);
    } catch (err) {
      console.error('Save failed', err);
      this.error = 'Failed to save todo.';
    } finally {
      this.saving = false;
    }
  }

  public cancel(): void {
    this.router.navigate(['/todos']);
  }
}
