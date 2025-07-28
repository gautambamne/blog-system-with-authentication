import type { Request, Response , NextFunction } from "express";

interface AsyncHandler {
    (req: Request, res: Response): Promise<void>; 
}


export default (fn : AsyncHandler) => (req : Request, res: Response, next: NextFunction) => { 
    Promise.resolve(fn(req, res))
    .catch((err) => next(err));
}