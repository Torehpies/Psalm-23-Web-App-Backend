import { Router } from "express";
import { updateDailySales, getDailySales } from "../controllers/dailySales.controller";

const router = Router();

router.post("/", updateDailySales);
router.get("/:date", getDailySales); // Use YYYY-MM-DD format for example 2024-12-09

export default router;
