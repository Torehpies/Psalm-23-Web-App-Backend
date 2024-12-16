import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddlewares';
import { approveUser, getAllUnapprovedUsers, getAllApprovedUsers, disableAccount } from '../controllers/approveUser.controller';

const router = express.Router();

router.get("/unapproved", getAllUnapprovedUsers);
router.get("/approved", getAllApprovedUsers);
router.post("/approve/:id", approveUser);
router.post("/disable/:id", disableAccount);

export default router;