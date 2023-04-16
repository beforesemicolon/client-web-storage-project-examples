import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { confirmAction, promptInput } from '../../utils';
import { Todo, TodoStatus } from '../../service/todo.service';
import { todoStore } from '../../stores/todo.store';

@Component({
  selector: 'todo-item[todo]',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItem {
  // @ts-ignore strictPropertyInitialization not having effect - this input is required by the component to work, so it should never have no value
  @Input() todo: Todo;
  @Output() completeTodo = new EventEmitter();
  @Output() markTodoDeleted = new EventEmitter();
  @Output() deleteTodo = new EventEmitter();
  @Output() restoreTodo = new EventEmitter();
  @Output() editName = new EventEmitter();
  @Output() editDescription = new EventEmitter();

  get completed() {
    return this.todo?.status === TodoStatus.Completed;
  }

  get deleted() {
    return this.todo?.status === TodoStatus.Deleted;
  }

  get statusLabel() {
    return this.completed
      ? 'Completed'
      : this.deleted
      ? 'Deleted'
      : 'In Progress';
  }

  get statusCls() {
    return this.completed
      ? 'completed'
      : this.deleted
      ? 'deleted'
      : 'in-progress';
  }
}
