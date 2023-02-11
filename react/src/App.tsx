import * as React from 'react';
import {useState, ChangeEvent} from 'react';
import FlatList from 'flatlist-react';
import {useClientStore} from 'client-web-storage/helpers/use-client-store';
import {todoStore} from './stores/todo.store';
import {Todo, TodoStatus} from './service/todo.service';
import {promptInput} from './utils';
import {TodoItem} from './components/todo-item';
import './style.scss';

export default function App() {
	// simply connect to your store with "useClientStore" hook
	// it will return the store state object to work with
	const {items, error, loadingItems} = useClientStore<Todo>(todoStore);
	const [searchTerm, setSearchTerm] = useState('');
	
	if (error) {
		return <div className="error-message">{error.message}</div>;
	}
	
	if (loadingItems) {
		return <div className="loading-indicator">Loading...</div>;
	}
	
	const updateSearchTerm = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
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
	
	const renderTodo = (todo: Todo) => <TodoItem todo={todo} key={todo.id}/>;
	
	const renderBlank = () => {
		if (searchTerm) {
			return <p>No items matched "{searchTerm}"</p>;
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
				{items.length ? (
					<div className="app-actions">
						<input
							type="search"
							placeholder="Search..."
							value={searchTerm}
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
					list={items}
					renderItem={renderTodo}
					renderWhenEmpty={renderBlank}
					display={{
						row: true,
						rowGap: '20px'
					}}
					search={{
						term: searchTerm,
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
