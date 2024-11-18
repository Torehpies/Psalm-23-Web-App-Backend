import { Request, Response, NextFunction } from 'express';
import Role from "../models/Role";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import { CreateError } from '../utils/error';
import { CreateSuccess } from '../utils/success';

export const register = async (req: Request, res: Response, next: NextFunction) => {
	const role = await Role.find({role: 'User'});
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if (!role){
		return next(CreateError(400, "Role not found"));
    }
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        roles: role
    });
	await newUser.save();
	return next(CreateSuccess(200, "User registered successfully"));
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return next(CreateError(404, "User not found"));
		}
		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
		if(!isPasswordCorrect){
			return next(CreateError(400, "Password is incorrect"));
		}
		return next(CreateSuccess(200, "Login Succcess"));
	} catch (error) {
		return next(CreateError(500, "Something went wrong"));
	}
}
