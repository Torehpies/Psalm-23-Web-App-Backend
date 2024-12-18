import express from "express";
import { getAllProductPerformance } from "../controllers/productPerformance.controller";

const router = express.Router();

router.get("/", getAllProductPerformance);

export default router;