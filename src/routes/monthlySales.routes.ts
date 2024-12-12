import { Router } from "express";
import { updateMonthlySales, getMonthlySales } from "../controllers/monthlySales.controller";

const router = Router();

router.post("/", updateMonthlySales);
router.get("/:year/:month", getMonthlySales); // Use YYYY/MM format for example 2024/12

export default router;