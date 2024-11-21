import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CreateError } from '../utils/error';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.access_token;
	if (!token) {
		return next(CreateError(401, "You are not authenticated"));
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string ) as JwtPayload;
		req.user = decoded; // Attach user data to the request object
		next();
	  } catch (error) {
		return res.status(403).json({ message: "Invalid or expired token" });
	  }
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
	verifyToken(req, res, () => {
		if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
			next();
		} else {
			return next(CreateError(403, "You are not authorized"));
		}
	})
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
	verifyToken(req, res, () => {
		if (req.user && req.user.isAdmin) {
			next();
		} else {
			return next(CreateError(403, "You are not authorized"));
		}
	})
}
