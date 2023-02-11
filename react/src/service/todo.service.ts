import {BaseService} from "./base.service";

export enum TodoStatus {
	InProgress,
	Completed,
	Deleted,
}

export interface Todo {
	id: string;
	name: string;
	description: string;
	status: TodoStatus
}

/**
 * Simple service to expose all endpoints to the TODO API
 */
class TodoService extends BaseService {
	getTodoList() {
		return this.get('/todo').then(res => res.data);
	}

	getTodo(id: string) {
		return this.get(`/todo/${id}`).then(res => res.data);
	}
	
	createTodo(data: Partial<Todo>) {
		return this.post('/todo', data).then(res => res.data);
	}
	
	updateTodo(id: string, data: Partial<Todo>) {
		return this.post(`/todo/${id}`, data).then(res => res.data);
	}
	
	deleteTodo(id: string) {
		return this.delete(`/todo/${id}`).then(res => res.data);
	}
	
	deleteList() {
		return this.delete(`/todo`).then(res => res.data);
	}
}

export const todoService = new TodoService();
