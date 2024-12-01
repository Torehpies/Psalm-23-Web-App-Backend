import express from 'express';
import { register, login, sendEmail, resetPassword} from '../controllers/auth.controller';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// router.post("/register-admin", registerAdmin);

//send reset password email
router.post("/send-email", sendEmail);

//reset password 
router.post("/reset-password", resetPassword);

export default router;
