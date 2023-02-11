import {Router, Response, Request} from "express";
import {loggerMiddleware} from "../../utils/logger.middleware";

export interface RouteData<T> {
	params: Record<string, any>;
	query: Record<string, any>;
	body: T;
	path: string;
}

export interface RouteHandler<T> {
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	path: string;
	handler: (data: RouteData<T>) => {};
}

export const createApiRoute = <T,>(handlers: RouteHandler<T>[]) => {
	const route = Router({
		mergeParams: true
	});
	
	handlers.forEach(({method, path, handler}) => {
		(route[method])(path, loggerMiddleware, async (req: Request, res: Response) => {
			try {
				const data = await handler({
					params: req.params ?? {},
					query: req.query ?? {},
					body: req.body ?? {},
					path: req.path
				});
				
				res.json({data})
			} catch(e) {
				console.error(e);
				res.sendStatus(500)
			}
		})
	})
	
	return route;
}
