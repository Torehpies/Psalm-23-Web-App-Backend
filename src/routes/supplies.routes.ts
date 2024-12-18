import * as express from "express";
import { getAllSupplies, getSupplyById, createSupply, updateSupply, deleteSupply } from "../controllers/supplies.controller";
import { verifyToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

export const suppliesRouter = express.Router();
suppliesRouter.use(express.json());

suppliesRouter.get("/", getAllSupplies);
suppliesRouter.get("/:id", getSupplyById);
suppliesRouter.post("/create", createSupply);
// suppliesRouter.post("/create",verifyToken,authorizeRoles("admin","baker"), createSupply);
suppliesRouter.put("/update/:id", updateSupply);
suppliesRouter.delete("/delete/:id", deleteSupply);