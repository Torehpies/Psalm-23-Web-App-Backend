import express from 'express';
import { register, login, sendEmail, resetPassword, getUsername} from '../controllers/auth.controller';
import { get } from 'http';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// router.post("/register-admin", registerAdmin);

//send reset password email
router.post("/send-email", sendEmail);

//reset password 
router.post("/reset-password", resetPassword);

router.get("/username", getUsername);

export default router;
