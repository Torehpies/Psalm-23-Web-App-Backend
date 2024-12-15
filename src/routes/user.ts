import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';
import { authorizeRoles } from '../middlewares/roleMiddlewares';
import { getAllUsers} from '../controllers/user.controller';

const router = express.Router();

router.get("/", getAllUsers);
// router.post("/approve/:id", approveUser);
// router.get("/barista", verifyToken, authorizeRoles("barista"), (req: Request, res: Response) => {
//     res.json({message: "Welcome barista"});
// });
// router.get("/helper", verifyToken, (req: Request, res: Response) => {
//     res.json({message: "Welcome helper"});
// });
export default router;