import * as React from 'react';
import { Fragment } from 'react';
import { Todo, TodoStatus } from '../service/todo.service';
import { promptInput, confirmAction } from '../utils';
import './todo-item.scss';
import {useClientStore} from "client-web-storage/helpers/use-client-store";
import {StoreNames} from "../stores";

export interface TodoItemProps {
  todo: Todo;
}

/**
 * the TodoItem is free to interact with the store which will trigger
 * the right API calls and data update focusing only the business logic
 * related to the UI rather than working with data and API inside the component
 */
export const TodoItem = ({ todo }: TodoItemProps) => {
  const todoStore = useClientStore<Todo>(StoreNames.Todo);
  const completed = todo.status === TodoStatus.Completed;
  const deleted = todo.status === TodoStatus.Deleted;
  const statusLabel = completed
    ? 'Completed'
    : deleted
    ? 'Deleted'
    : 'In Progress';
  const statusCls = completed
    ? 'completed'
    : deleted
    ? 'deleted'
    : 'in-progress';

  const completeTodo = () => {
    todoStore.updateItem(todo.id, {
      status: completed ? TodoStatus.InProgress : TodoStatus.Completed,
    });
  };

  const markTodoDeleted = () => {
    todoStore.updateItem(todo.id, {
      status: TodoStatus.Deleted,
    });
  };
  
  const deleteTodo = () => {
    const confirmed = confirmAction(
      `Are you sure you want to permanently delete "${todo.name}" todo? This action cannot be reverted!`
    );
    
    if (confirmed) {
      todoStore.removeItem(todo.id);
    }
  };

  const restoreTodo = () => {
    todoStore.updateItem(todo.id, {
      status: TodoStatus.InProgress,
    });
  };

  const editName = () => {
    const newName = promptInput('Update name', todo.name);

    if (newName && newName.trim().length) {
      todoStore.updateItem(todo.id, {
        name: newName,
      });
    }
  };

  const editDescription = () => {
    const newDescription = promptInput('Update Description', todo.description);

    if (newDescription && newDescription.trim().length) {
      todoStore.updateItem(todo.id, {
        description: newDescription,
      });
    }
  };

  return (
    <div className="todo-item">
      <h3>
        <strong className={`status ${statusCls}`}>{statusLabel}</strong>
        <span onClick={editName}>
          {todo.name}
        </span>
      </h3>
      <p className="description" onClick={editDescription}>
        {todo.description}
      </p>
      <div className="actions">
        {deleted ? (
          <Fragment>
            <button
              type="button"
              onClick={restoreTodo}
              className="btn sm"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={deleteTodo}
              className="btn sm outline"
            >
              Delete Permanently
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <button type="button" onClick={completeTodo} className="btn sm cta">
              {completed ? 'Move in Progress' : 'Mark as Done'}
            </button>
            <button
              type="button"
              onClick={markTodoDeleted}
              className="btn sm outline"
            >
              Delete
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
};
