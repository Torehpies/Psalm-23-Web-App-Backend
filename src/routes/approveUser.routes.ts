import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddlewares';
import { approveUser, getAllUnapprovedUsers } from '../controllers/approveUser.controller';

const router = express.Router();

router.get("/", getAllUnapprovedUsers);
router.post("/approve/:id", approveUser);

export default router;