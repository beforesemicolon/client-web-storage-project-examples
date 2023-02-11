import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
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

  completeTodo = () => {
    todoStore.updateItem(this.todo.id, {
      status: this.completed ? TodoStatus.InProgress : TodoStatus.Completed,
    });
  };

  markTodoDeleted = () => {
    todoStore.updateItem(this.todo.id, {
      status: TodoStatus.Deleted,
    });
  };

  deleteTodo = () => {
    const confirmed = confirmAction(
      `Are you sure you want to permanently delete "${this.todo?.name}" todo? This action cannot be reverted!`
    );

    if (confirmed) {
      todoStore.removeItem(this.todo.id);
    }
  };

  restoreTodo = () => {
    todoStore.updateItem(this.todo.id, {
      status: TodoStatus.InProgress,
    });
  };

  editName = () => {
    const newName = promptInput('Update name', this.todo?.name);

    if (newName && newName.trim().length) {
      todoStore.updateItem(this.todo.id, {
        name: newName,
      });
    }
  };

  editDescription = () => {
    const newDescription = promptInput(
      'Update Description',
      this.todo?.description
    );

    if (newDescription && newDescription.trim().length) {
      todoStore.updateItem(this.todo.id, {
        description: newDescription,
      });
    }
  };
}
