import fs from "fs";
import {writeFile} from "fs/promises";
import crypto from "crypto";

export class DB<T> {
	#items: Record<string, T> = {};
	
	constructor(
		private dbJsonPath: string = '',
		private defaultItem: Partial<T>
	) {
		this.#items = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'))
			.reduce((acc: Record<string, unknown>, c: any) => ({...acc, [c.id]: c}), {});
	}
	
	async getAll(): Promise<T[]> {
		return Object.values(this.#items);
	}
	
	async getOne(id: string): Promise<T | null> {
		return this.#items[id] ?? null;
	}
	
	async addOne(comp: T) {
		const id = crypto.randomUUID()
		this.#items[id] = {
			...this.defaultItem,
			...comp,
			id
		};
		
		await writeFile(this.dbJsonPath, JSON.stringify(Object.values(this.#items)));
		
		return this.#items[id];
	}
	
	async updateOne (id: string, comp: T) {
		if (this.#items[id]) {
			this.#items[id] = {
				...this.defaultItem,
				...this.#items[id],
				...comp,
				id
			};
			
			await writeFile(this.dbJsonPath, JSON.stringify(Object.values(this.#items)));
			
			return this.#items[id];
		}
		
		
		return null;
	}
	
	async deleteOne(id: string) {
		if (this.#items[id]) {
			delete this.#items[id];
			
			await writeFile(this.dbJsonPath, JSON.stringify(Object.values(this.#items)));
			
			return id;
		}
		
		return null
	}
	
	async deleteAll() {
		this.#items = {}
		
		await writeFile(this.dbJsonPath, '[]');
	}
}
