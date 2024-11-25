import * as express from "express";
import { getAllStockHistory, getStockHistoryById, createStockHistory, updateStockHistory, deleteStockHistory } from "../controllers/stockHistory.controller";

export const stockHistoryRouter = express.Router();
stockHistoryRouter.use(express.json());

stockHistoryRouter.get("/", getAllStockHistory);
stockHistoryRouter.get("/:id", getStockHistoryById);
stockHistoryRouter.post("/create", async (req, res, next) => {
    try {
        await createStockHistory(req, res);
    } catch (error) {
        next(error);
    }
});
stockHistoryRouter.put("/:id", updateStockHistory);
stockHistoryRouter.delete("/:id", deleteStockHistory);
