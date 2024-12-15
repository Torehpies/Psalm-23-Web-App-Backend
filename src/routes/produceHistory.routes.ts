import * as express from "express";
import { getAllProduceHistories, getProduceHistoryById, createProduceHistory, updateProduceHistory, deleteProduceHistory } from "../controllers/produceHistory.controller";

export const produceHistoryRouter = express.Router();
produceHistoryRouter.use(express.json());

produceHistoryRouter.get("/", getAllProduceHistories);
produceHistoryRouter.get("/:id", getProduceHistoryById);
produceHistoryRouter.post("/create", createProduceHistory);
produceHistoryRouter.put("/update/:id", updateProduceHistory);
produceHistoryRouter.delete("/delete/:id", deleteProduceHistory);