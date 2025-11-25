import { Routes } from '@angular/router';
import { TodosComponent } from './features/todos/components/todos/todos.component';
import { EdiTodoComponent } from './features/todos/components/todos/edit-todo/edit-todos.component';

export const routes: Routes = [
  { path: '', component: TodosComponent },
  { path: 'todo', component: EdiTodoComponent },
  { path: 'todo/:id', component: EdiTodoComponent },
  { path: '**', redirectTo: '' }
];
