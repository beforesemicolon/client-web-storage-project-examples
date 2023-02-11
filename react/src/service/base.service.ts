export class BaseService {
	#base = 'http://localhost:4500/api';

	get(endpoint: string) {
		return fetch(`${this.#base}${endpoint}`)
			.then(res => res.json())
	}

	post(endpoint: string, data: any, opt: any = {}) {
		return fetch(`${this.#base}${endpoint}`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				...(opt?.headers ?? {} )
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
	}

	delete(endpoint: string) {
		return fetch(`${this.#base}${endpoint}`, {
			method: "DELETE",
		})
			.then(res => res.json())
	}
	
}
