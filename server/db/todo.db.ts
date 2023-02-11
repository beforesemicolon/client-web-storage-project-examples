import path from "path";
import {DB} from "./DB";
import {Todo} from "../api/todo.api";

export const todoDb = new DB<Todo>(
	path.resolve(__dirname, './todo.db.doc.json'),
	{
		name: "--",
	}
)
