import * as React from 'react';
import {Fragment} from 'react';
import {Todo, TodoStatus} from '../service/todo.service';
import './todo-item.scss';

export interface TodoItemProps {
  todo: Todo;
  onEditName: () => void,
  onEditDescription: () => void,
  onRestoreTodo: () => void,
  onDeleteTodo: () => void,
  onCompleteTodo: () => void,
  onMarkTodoDeleted: () => void
}

/**
 * the TodoItem is free to interact with the store which will trigger
 * the right API calls and data update focusing only the business logic
 * related to the UI rather than working with data and API inside the component
 */
export const TodoItem = ({ todo, onEditName, onEditDescription, onRestoreTodo, onDeleteTodo, onCompleteTodo, onMarkTodoDeleted }: TodoItemProps) => {
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

  return (
    <div className="todo-item">
      <h3>
        <strong className={`status ${statusCls}`}>{statusLabel}</strong>
        <span onClick={onEditName}>
          {todo.name}
        </span>
      </h3>
      <p className="description" onClick={onEditDescription}>
        {todo.description}
      </p>
      <div className="actions">
        {deleted ? (
          <Fragment>
            <button
              type="button"
              onClick={onRestoreTodo}
              className="btn sm"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={onDeleteTodo}
              className="btn sm outline"
            >
              Delete Permanently
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <button type="button" onClick={onCompleteTodo} className="btn sm cta">
              {completed ? 'Move in Progress' : 'Mark as Done'}
            </button>
            <button
              type="button"
              onClick={onMarkTodoDeleted}
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
