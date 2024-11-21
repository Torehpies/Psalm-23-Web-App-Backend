import { Request, Response, NextFunction } from 'express';
import Role from "../models/Role";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const role = await Role.find({});
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
		isAdmin: true,
        roles: role
    });
	await newUser.save();
	return next(CreateSuccess(200, "Admin registered successfully"));
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		.populate("roles", "role");

		if (!user) {
			return next(CreateError(404, "User not found"));
		}
		
		const { roles } = user;

		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
		if(!isPasswordCorrect){
			return next(CreateError(400, "Password is incorrect"));
		}

		const token = jwt.sign(
			{id: user._id, isAdmin: user.isAdmin, roles: roles},
			process.env.JWT_SECRET as string,
		)

		res.cookie("access_token", token, {httpOnly: true})
		.status(200)
		.json({
				status: 200,
				message: "Login Success",
				data: user
			})
	} catch (error) {
		return next(CreateError(500, "Something went wrong"));
	}
}
