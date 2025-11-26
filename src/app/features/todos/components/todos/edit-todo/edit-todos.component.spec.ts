import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EdiTodoComponent } from './edit-todos.component';
import { TodoApiService } from '../../../services/todos-api.service';

describe('EdiTodoComponent', () => {
  function setup(idParam: string | null, todoApiMock?: any, routerMock?: any) {
    const activatedRouteMock = { snapshot: { paramMap: { get: (k: string) => idParam } } };

    const todoApi = todoApiMock ?? jasmine.createSpyObj('TodoApiService', ['getTodo', 'updateTodo', 'createTodo']);
    todoApi.getTodo = todoApi.getTodo || (jasmine.createSpy().and.returnValue(Promise.resolve(undefined)));
    todoApi.updateTodo = todoApi.updateTodo || (jasmine.createSpy().and.returnValue(Promise.resolve(undefined)));
    todoApi.createTodo = todoApi.createTodo || (jasmine.createSpy().and.returnValue(Promise.resolve({ id: 1 })));

    const router = routerMock ?? { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };

    TestBed.configureTestingModule({
      imports: [EdiTodoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: router },
        { provide: TodoApiService, useValue: todoApi }
      ]
    });

    const fixture = TestBed.createComponent(EdiTodoComponent);
    const component = fixture.componentInstance;
    return { fixture, component, todoApi, router };
  }

  it('creates', () => {
    const { component } = setup(null);
    expect(component).toBeTruthy();
  });

  it('loads todo when id is present on init', async () => {
    const todo = { id: 5, title: 'Test title', description: 'd', isCompleted: false, dueDate: null };
    const todoApiMock = jasmine.createSpyObj('TodoApiService', ['getTodo', 'updateTodo', 'createTodo']);
    todoApiMock.getTodo.and.returnValue(Promise.resolve(todo));

    const { component, todoApi } = setup('5', todoApiMock);

    await component.ngOnInit();

    expect(todoApi.getTodo).toHaveBeenCalledWith(5);
    expect(component.model.title).toBe('Test title');
    expect(component.loading).toBeFalse();
  });

  it('save() updates when id present and navigates', async () => {
    const todoApiMock = jasmine.createSpyObj('TodoApiService', ['getTodo', 'updateTodo', 'createTodo']);
    todoApiMock.updateTodo.and.returnValue(Promise.resolve());
    const routerMock = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };

    const { component, todoApi, router } = setup('2', todoApiMock, routerMock);

    // ensure component has an id
    component.model = { id: 2, title: 't', description: '', isCompleted: false };

    await component.save();

    expect(todoApi.updateTodo).toHaveBeenCalledWith(2, jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
    expect(component.saving).toBeFalse();
  });

  it('save() creates when no id and navigates', async () => {
    const todoApiMock = jasmine.createSpyObj('TodoApiService', ['getTodo', 'updateTodo', 'createTodo']);
    todoApiMock.createTodo.and.returnValue(Promise.resolve({ id: 99 }));
    const routerMock = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };

    const { component, todoApi, router } = setup(null, todoApiMock, routerMock);

    component.model = { title: 'new', description: '', isCompleted: false };

    await component.save();

    expect(todoApi.createTodo).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
    expect(component.saving).toBeFalse();
  });

  it('cancel() navigates back to /todos', () => {
    const routerMock = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };
    const { component, router } = setup(null, undefined, routerMock);

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
  });
});
