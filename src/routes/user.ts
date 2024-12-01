import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';
import { authorizeRoles } from '../middlewares/roleMiddlewares';

const router = express.Router();

router.get("/admin", );
router.get("/manager", );
router.get("/baker", );
router.get("/cashier", );
router.get("/barista", verifyToken, authorizeRoles("barista"), (req: Request, res: Response) => {
    res.json({message: "Welcome barista"});
});
router.get("/helper", verifyToken, (req: Request, res: Response) => {
    res.json({message: "Welcome helper"});
});
export default router;

// import express from 'express';
// import { getAllUsers, getById } from '../controllers/user.controller';
// import { verifyAdmin, verifyUser } from '../utils/verifyToken';

// const router = express.Router();

// router.get("/", verifyAdmin, getAllUsers);

// router.get("/:id", verifyUser, getById);

// export default router;
