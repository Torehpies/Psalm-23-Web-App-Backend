import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/error';

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(CreateError(401, "Unauthorized"));
        }
        
        if(!allowedRoles.includes(req.user.role)){
            return next(CreateError(403, "Access Denied"));
        }
        next();
    }
}