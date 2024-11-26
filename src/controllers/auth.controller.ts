import { Request, Response, NextFunction } from 'express';
import Role from "../models/Role";
import User from "../models/User";
import UserToken from "../models/UserToken";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
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
		position: req.body.position,
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

export const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
	const email = req.body.email;
	const user = await User.findOne({email: {$regex: '^' + email + '$', $options: 'i'}});
	if (!user){
		return next(CreateError(404, "User not found to rest the email"));
	}
	const payload = {
		email: user.email
	}
	const expiryTime = 300;
	const token = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: expiryTime});

	const newToken = new UserToken({
		userId: user._id,
		token: token
	});

	const mailTransporter = nodeMailer.createTransport({
		service: 'gmail',
		auth: {
			user: "psalm23authentication@gmail.com",
			pass: "jseaavwynsgyoucv",
		}
	});

	let mailDetails = {
		from: "psalm23authentication@gmail.com",
		to: email,
		subject: "Reset Password",
		html: `
<html>
<head>
	<title>Password Reset Request</title>
</head>
<body>
	<h1>Password Reset Request</h1>
	<p>Dear ${user.firstName},</p>
	<p>We have received a request to reset your password for your account with Psalm 23 Cafe. Please click the button to complete your request.</p>
	<a href=${process.env.LIVE_URL}/reset/${token}>
		<button style = "background-color: #4CAF50; color: white; padding: 14px 20px; border: none;
		cursor: pointer; border-radius: 4px;">Reset Password</button></a>
	<p>Please note that this link is only valid for 5 minutes.</p>
	<p>Thank you,</p>
	<p>Psalm 23 Team</p>
</body>
</html>
		`,
	};
	mailTransporter.sendMail(mailDetails, async(err, data) => {
		if(err){
			console.log(err);
			return next(CreateError(500, "Something went wrong while sending the email"))
		}else {
			await newToken.save();
			return next(CreateSuccess(200, "Email sent successfully"));
		}
	})
}
