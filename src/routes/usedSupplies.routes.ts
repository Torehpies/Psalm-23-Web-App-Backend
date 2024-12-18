import * as express from "express";
import { getAllUsedSupplies, getUsedSupplyById, createUsedSupply, updateUsedSupply, deleteUsedSupply } from "../controllers/UsedSupplies.controller";

export const usedSuppliesRouter = express.Router();
usedSuppliesRouter.use(express.json());

usedSuppliesRouter.get("/", getAllUsedSupplies);
usedSuppliesRouter.get("/:id", getUsedSupplyById);
usedSuppliesRouter.post("/create", createUsedSupply);
usedSuppliesRouter.put("/:id", async (req, res, next) => {
    try {
        await updateUsedSupply(req, res);
    } catch (error) {
        next(error);
    }
});
usedSuppliesRouter.delete("/:id", async (req, res, next) => {
    try {
        await deleteUsedSupply(req, res);
    } catch (error) {
        next(error);
    }
});