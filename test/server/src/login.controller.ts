import { Request, Response, NextFunction} from "express";
import { collections } from "./database";
import bcrypt from "bcrypt";  // For hashing passwords, if needed
import jwt from "jsonwebtoken";  // For generating JWT tokens

const JWT_SECRET = "your-secret-key";  // Replace with a secure key

// Controller for login
export const loginController = {
    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log("POST /login", req.body);
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).send("Email and password are required");
                return;
            }

            // Fetch user from the database
            const user = await collections?.users?.findOne({ email });

            if (!user) {
                res.status(401).send("Invalid credentials");
                return;
            }

            // Verify password (assuming passwords are hashed in the database)
            const passwordMatch = await user.password;
            if (!passwordMatch) {
                res.status(401).send("Invalid credentials");
                return;
            }

            // Generate JWT
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: "Login successful", token, user });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            console.error(message);
            res.status(500).send(message);
        }
    },
};
