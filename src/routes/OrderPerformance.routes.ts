import { Router } from "express";
import { updateOrderPerformance, getOrderPerformance } from "../controllers/OrderPerformance.controller";

const router = Router();

router.post("/", updateOrderPerformance);
router.get("/:date", getOrderPerformance); // Use YYYY-MM-DD format for example 2024-12-09 may gawa na ko

export default router;
