import * as React from 'react';
import {ChangeEvent} from 'react';
import FlatList from 'flatlist-react';
import {useClientStore} from 'client-web-storage/helpers/use-client-store';
import {useAppState} from 'client-web-storage/helpers/use-app-state';
import {Todo, TodoStatus} from './service/todo.service';
import {confirmAction, promptInput} from './utils';
import {TodoItem} from './components/todo-item';
import './style.scss';
import {StoreNames} from "./stores";
import {AppStateNames, AppStateType} from "./states";

export default function App() {
	// simply connect to your store with "useClientStore" hook
	// it will return the store state object to work with
	const todoStore = useClientStore<Todo>(StoreNames.Todo);
	const {state, setState} = useAppState<AppStateType>(AppStateNames.App);
	
	const updateSearchTerm = (event: ChangeEvent<HTMLInputElement>) => {
		setState({
			searchTerm: event.target.value
		});
	};
	
	const createTodo = async () => {
		const name = promptInput('Enter Todo Name:');
		
		if (name && name.trim().length) {
			try {
				// when performing actions, simply interact with the store directly
				// it is the interface to your server and storage APIs
				await todoStore.createItem({
					name,
				});
			} catch (e) {
				// you can handle error locally
				// or listen/subscribe to the ERROR event
				// or simply react to the "error" from using the "useClientStore" hook
				console.error(e);
			}
		}
	};
	
	const completeTodo = (todoId: string, completed: boolean) => {
		todoStore.updateItem(todoId, {
			status: completed ? TodoStatus.InProgress : TodoStatus.Completed,
		});
	};
	
	const markTodoDeleted = (todoId: string) => {
		todoStore.updateItem(todoId, {
			status: TodoStatus.Deleted,
		});
	};
	
	const deleteTodo = (todoId: string, todoName: string) => {
		const confirmed = confirmAction(
			`Are you sure you want to permanently delete "${todoName}" todo? This action cannot be reverted!`
		);
		
		if (confirmed) {
			todoStore.removeItem(todoId);
		}
	};
	
	const restoreTodo = (todoId: string) => {
		todoStore.updateItem(todoId, {
			status: TodoStatus.InProgress,
		});
	};
	
	const editName = (todoId: string, todoName: string) => {
		const newName = promptInput('Update name', todoName);
		
		if (newName && newName.trim().length) {
			todoStore.updateItem(todoId, {
				name: newName,
			});
		}
	};
	
	const editDescription = (todoId: string, todoDescription: string) => {
		const newDescription = promptInput('Update Description', todoDescription);
		
		if (newDescription && newDescription.trim().length) {
			todoStore.updateItem(todoId, {
				description: newDescription,
			});
		}
	};
	
	const renderTodo = (todo: Todo) => (
		<TodoItem todo={todo} key={todo.id}
		          onCompleteTodo={() => completeTodo(todo.id, todo.status === TodoStatus.Completed)}
		          onMarkTodoDeleted={() => markTodoDeleted(todo.id)}
		          onDeleteTodo={() => deleteTodo(todo.id, todo.name)}
		          onRestoreTodo={() => restoreTodo(todo.id)}
		          onEditName={() => editName(todo.id, todo.name)}
		          onEditDescription={() => editDescription(todo.id, todo.description)}
		/>
	);
	
	const renderBlank = () => {
		if (todoStore.error) {
			return <div className="error-message">{todoStore.error.message}</div>;
		}
		
		if (todoStore.loadingItems) {
			return <div className="loading-indicator">Loading...</div>;
		}
		
		if (state.searchTerm) {
			return <p>No items matched "{state.searchTerm}"</p>;
		}
		
		return (
			<div className="blank-status">
				<p>No Todo Items Yet!</p>
				<button type="button" onClick={createTodo} className="cta">
					Create Todo
				</button>
			</div>
		);
	};
	
	return (
		<div>
			<header>
				<h1>Todo Management App</h1>
				{todoStore.items.length ? (
					<div className="app-actions">
						<input
							type="search"
							placeholder="Search..."
							value={state.searchTerm}
							onChange={updateSearchTerm}
						/>
						<button type="button" onClick={createTodo} className="btn sm">
							Create
						</button>
					</div>
				) : (
					''
				)}
			</header>
			<hr/>
			<main className="list-container">
				{/* FlatList is a swiss knife of handling lists with many useful operations which saves us time */}
				<FlatList
					list={todoStore.items}
					renderItem={renderTodo}
					renderWhenEmpty={renderBlank}
					display={{
						row: true,
						rowGap: '20px'
					}}
					search={{
						term: state.searchTerm,
						by: ['name', 'description'],
						caseInsensitive: true,
						minCharactersCount: 2
					}}
					sort={{
						by: 'status',
					}}
					group={{
						by: (todo) =>
							todo.status === TodoStatus.Deleted
								? 'Deleted Todos'
								: 'Active Todos',
						separator: (group, idx, groupLabel) => (
							<h2 className="todos-section-title">
								{groupLabel} ({group.length})
							</h2>
						),
						sortedBy: 'status',
						sortedDescending: false
					}}
				/>
			</main>
		</div>
	);
}
