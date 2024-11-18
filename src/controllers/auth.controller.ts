import { Request, Response, NextFunction } from 'express';
import Role from "../models/Role";
import User from "../models/User";
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const role = await Role.find({role: 'User'});
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if (!role){
        res.status(400).send("Role not found");
    }
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        roles: role
    });
	await newUser.save();
	res.status(200).send("User was registered successfully!");
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(404).send("User not found");
			return;
		}
		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
		if(!isPasswordCorrect){
			res.status(400).send("Password is incorrect");
		}
		res.status(200).send("Logged in successfully");
	} catch (error) {
		res.status(500).send("Something went wrong");
	}
}
