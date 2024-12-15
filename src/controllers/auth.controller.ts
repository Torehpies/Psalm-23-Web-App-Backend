import { Request, Response, NextFunction } from 'express';
import User from "../models/user";
import UserToken from "../models/UserToken";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import { CreateError } from '../utils/error';
import { CreateSuccess } from '../utils/success';
import { VerifyErrors, JwtPayload } from 'jsonwebtoken';
// import { getRolePermissions, Role } from '../utils/rolePermissions';

export const register = async (req: Request, res: Response, next: NextFunction) => {
	//const role = await Role.find({role: 'User'});
	const { firstName, lastName, email, password, position } = req.body;

	const existingUser = await User.findOne({ email });
    if (existingUser) {
		return next(CreateError(400, "Email already exists"));
    }

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	const lowercasePosition : string = position.toLowerCase();
	//const permissions = getRolePermissions(lowercasePosition as Role);
	
    const newUser = new User({
        firstName,
        lastName,
        role: lowercasePosition,
        email,
        password: hashedPassword
    });

	try {
		await newUser.save();
		return next(CreateSuccess(200, "User registered successfully"));	
	} catch (error) {
		console.log(error);
		return next(CreateError(500,"Something went wrong"))
	}
	
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (!user) {
			return next(CreateError(404, "Email not found"));
		}
		
		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
		if(!isPasswordCorrect){
			return next(CreateError(400, "Password is incorrect"));
		}

		const token = jwt.sign(
			{id: user._id, role: user.role},
			process.env.JWT_SECRET as string,
			{expiresIn: "5hr"},
		)

		 res.status(200).json({
			token,
		  });
		// res.cookie("access_token", token, {httpOnly: true})
		// .status(200)
		// .json({
		// 		status: 200,
		// 		message: "Login Success",
		// 		data: user
		// 	})
	} catch (error) {
		return next(CreateError(500, "Something went wrong"));
	}
}

export const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
	const email = req.body.email;
	const user = await User.findOne({email: {$regex: '^' + email + '$', $options: 'i'}});
	if (!user){
		return next(CreateError(404, "Email not found"));
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

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.body.token;
	const newPassword = req.body.password;

	jwt.verify(token, process.env.JWT_SECRET as string, async (err: jwt.VerifyErrors | null, decoded: any) => {
		if(err){
			//console.log(err);
			return next(CreateError(500, "Invalid or expired token"));
		}else{
			const response = decoded;
			const user = await User.findOne({email: {$regex: '^' + response.email + '$', $options: 'i'}});
			if (!user) {
				return next(CreateError(404, "User not found"));
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);
			user.password = hashedPassword;
			try {
				const updatedUser = await User.findOneAndUpdate(
					{_id: user._id},
					{$set: user},
					{new: true}
				)
				return next(CreateSuccess(200, "Password reset successfully"));
			} catch (error) {
				return next(CreateError(500, "Something went wrong while resetting the password"));
			}
		}
	})
}

export const getUsername = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return next(CreateError(401, "Access denied. No token provided."));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
		const user = await User.findById(decoded.id).select("firstName lastName");
		if (!user) {
			return next(CreateError(404, "User not found"));
		}
		res.status(200).json({
			firstName: user.firstName,
			lastName: user.lastName
		});
	} catch (error) {
		return next(CreateError(400, "Invalid token"));
	}
}
