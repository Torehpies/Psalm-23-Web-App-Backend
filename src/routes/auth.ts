import express from 'express';
import { register, login, registerAdmin, sendEmail } from '../controllers/auth.controller';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/register-admin", registerAdmin);

//send reset password email

router.post("/send-email", sendEmail);

export default router;
