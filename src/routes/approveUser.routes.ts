import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddlewares';
import { approveUser, getAllUnapprovedUsers, getAllApprovedUsers, disableAccount, rejectAccount, updateAccount } from '../controllers/approveUser.controller';

const router = express.Router();

router.get("/unapproved", getAllUnapprovedUsers);
router.get("/approved", getAllApprovedUsers);
router.patch("/approve/:id", approveUser);
router.patch("/disable/:id", disableAccount);
router.patch("/reject/:id", rejectAccount);
router.put("/:id", updateAccount);

export default router;