import express from "express";
import { getAllProduceHistories, getProduceHistoryById, createProduceHistory, updateProduceHistory, deleteProduceHistory } from "../controllers/produceHistory.controller";

const router = express.Router();

router.get("/", getAllProduceHistories);
router.get("/:id", getProduceHistoryById);
router.post("/create", createProduceHistory);
router.put("/update/:id", updateProduceHistory);
router.delete("/delete/:id", deleteProduceHistory);

export default router;