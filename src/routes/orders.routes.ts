import { Router } from "express";
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from "../controllers/orders.controller";
import { updateOrderPerformance } from "../controllers/OrderPerformance.controller";

const router = Router();

router.post("/create", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/performance", updateOrderPerformance); // di na ata need to dito lang kasi nadeclare ko

export default router;