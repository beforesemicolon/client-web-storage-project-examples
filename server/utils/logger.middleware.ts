import {NextFunction, Request, Response} from "express";

export const loggerMiddleware = (req: Request, _: Response, next: NextFunction) => {
	console.log('---------------------');
	console.log(`path:`, req.path);
	console.log(`method:`, req.method);
	console.log(`params:`, req.params);
	console.log(`body:`, req.body);
	console.log('---------------------');
	next()
}
