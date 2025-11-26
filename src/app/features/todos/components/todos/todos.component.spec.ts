import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TodosComponent } from './todos.component';
import { TodoApiService } from '../../services/todos-api.service';
import { Todo } from '../../models/todo.model';


describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let todoApiSpy: jasmine.SpyObj<TodoApiService>;

  const sampleTodo: Todo = {
    id: 1,
    title: 'Sample',
    description: 'Sample description',
    dueDate: '2021-05-20T00:00:00Z',
    isCompleted: false
  };

  beforeEach(waitForAsync(() => {
    todoApiSpy = jasmine.createSpyObj('TodoApiService', ['getTodos', 'deleteTodo', 'updatePartialTodo']);
    // default getTodos returns single sample
    todoApiSpy.getTodos.and.returnValue(Promise.resolve([sampleTodo]));

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, TodosComponent],
      providers: [
        { provide: TodoApiService, useValue: todoApiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('cycles completed filter through null -> true -> false -> null and calls onFilterChange', () => {
    spyOn(component, 'onFilterChange');

    // initial should be null (All)
    expect(component.isCompleted).toBeNull();

    component.onCompletedInput();
    expect(component.isCompleted).toBeTrue();
    expect(component.onFilterChange).toHaveBeenCalledTimes(1);

    component.onCompletedInput();
    expect(component.isCompleted).toBeFalse();

    component.onCompletedInput();
    expect(component.isCompleted).toBeNull();
  });

  it('toggleCompleted calls updatePartialTodo and reloads todos', async () => {
    const todo: any = { id: 42, isCompleted: true };
    todoApiSpy.updatePartialTodo.and.returnValue(Promise.resolve());

    const loadSpy = spyOn<any>(component, 'loadTodos').and.returnValue(Promise.resolve());

    await component.toggleCompleted(todo);

    expect(todoApiSpy.updatePartialTodo).toHaveBeenCalledWith(42, { isCompleted: false });
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should load todos on init and map dueDate to date-only string', () => {
    expect(todoApiSpy.getTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(1);
    const t = component.todos[0];
    // model-mapper produces yyyy-MM-dd for release date used by inputs/display
    expect(t.dueDate?.substring(0, 10)).toBe('2021-05-20');
    expect(t.title).toBe('Sample');
    expect(t.description).toBe('Sample description');
  });

  it('should debounce name input and call getTodos after 500ms', fakeAsync(async () => {
    // reset call count from initial load
    todoApiSpy.getTodos.calls.reset();
    // prepare spy to resolve when called
    todoApiSpy.getTodos.and.returnValue(Promise.resolve([sampleTodo]));

    component.onTitleInput('abc');
    // before debounce elapsed, should not have called
    tick(400);
    expect(todoApiSpy.getTodos).not.toHaveBeenCalled();

    // after debounce
    tick(100);
    // allow microtasks to flush promise resolution
    await Promise.resolve();
    expect(todoApiSpy.getTodos).toHaveBeenCalled();
  }));

  it('deleteTodo should call api.deleteTodo and reload list', async () => {
    // make getTodos return different results: first call already happened in ngOnInit
    // ensure subsequent getTodos call (after delete) returns empty list
    todoApiSpy.getTodos.and.returnValues(Promise.resolve([sampleTodo]), Promise.resolve([]));
    todoApiSpy.deleteTodo.and.returnValue(Promise.resolve());

    // call delete
    await component.deleteTodo(sampleTodo.id);
    // after delete, loadTodos should have been called again so getTodos called at least once more
    expect(todoApiSpy.deleteTodo).toHaveBeenCalledWith(sampleTodo.id);
  });
});