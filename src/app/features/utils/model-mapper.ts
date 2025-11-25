import { Todo } from "../todos/models/todo.model";
import { EditTodoViewModel, TodoViewModel } from "../todos/models/todo.viewmodel";

export function mapToTodoViewModel(todo: Todo): TodoViewModel {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    isCompleted: todo.isCompleted,
    dueDate: todo.dueDate,
    createdAt: todo.createdAt
  };
}

export function mapToEditTodoViewModel(todo: Todo): EditTodoViewModel {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    isCompleted: todo.isCompleted,
    // need yyyy-MM-dd for input type="date"
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().substring(0, 10) : undefined,
  };
}

export function mapToTodo(model: EditTodoViewModel): Todo {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    isCompleted: model.isCompleted,
    dueDate: model.dueDate
  };
}