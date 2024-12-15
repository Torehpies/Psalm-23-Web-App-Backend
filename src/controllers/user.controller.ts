import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.find().select("firstName lastName role");
		return next(CreateSuccess(200, "All users fetched successfully", users));
	} catch (error) {
		return next(CreateError(500, "Internal Server Error"));	
	}
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user){
			return next(CreateError(404, "User not found"));
		}else {
			return next(CreateSuccess(200, "User fetched successfully", user));
		}
	} catch (error) {
		return next(CreateError(500, "Internal Server Error"));	
	}
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(CreateError(404, "Email not found"));
        }
        if (!user.isApproved) {
            return next(CreateError(403, "User not approved"));
        }
        // ...existing code...
    } catch (error) {
        return next(CreateError(500, "Something went wrong"));
    }
}
