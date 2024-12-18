import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/error';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token;
    const authHeader = req.headers.authorization as string || req.headers.Authorization as string;
    if (authHeader?.startsWith("Bearer")){
        token = authHeader.split(" ")[1];

        if(!token) {
            return next(CreateError(401, "No token, authorization denied"));
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
            req.user = decode;
            // console.log("The decoded user is :", req.user);
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return next(CreateError(401, "Token has expired"));
            } else if (error instanceof jwt.JsonWebTokenError) {
                return next(CreateError(400, "Token is not valid"));
            } else {
                return next(CreateError(500, "Internal server error"));
            }
        }
    }else{
        return next(CreateError(401, "No token, authorization denied"));
    }
}