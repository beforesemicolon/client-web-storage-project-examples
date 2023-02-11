import {todoDb} from '../db/todo.db';
import {createApiRoute} from "./utils/create-api-route";

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

export const todoRoute = createApiRoute<Todo>([
	{
		method: 'get',
		path: '/:todoId',
		handler: ({params}) => todoDb.getOne(params.todoId)
	},
	{
		method: 'get',
		path: '/',
		handler: () => todoDb.getAll()
	},
	{
		method: 'post',
		path: '/:todoId',
		handler: ({params, body}) => todoDb.updateOne(params.todoId, body)
	},
	{
		method: 'post',
		path: '/',
		handler: ({body}) => todoDb.addOne(body)
	},
	{
		method: 'delete',
		path: '/:todoId',
		handler: ({params}) => todoDb.deleteOne(params.todoId)
	},
	{
		method: 'delete',
		path: '/',
		handler: () => todoDb.deleteAll()
	},
])
