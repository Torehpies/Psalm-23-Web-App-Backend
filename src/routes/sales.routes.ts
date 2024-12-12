import * as express from "express";
import { getSales, getAllSales } from "../controllers/sales.controller"; 
const salesRouter = express.Router();
salesRouter.use(express.json());

salesRouter.get("/", async (req, res, next) => {
    try {
        await getSales(req, res);
    } catch (error) {
        next(error);
    }
});

salesRouter.get("/all", async (_req, res, next) => {
    try {
        await getAllSales(_req, res);
    } catch (error) {
        next(error);
    }
});

export default salesRouter;