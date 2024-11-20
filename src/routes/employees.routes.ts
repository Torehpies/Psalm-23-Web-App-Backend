import * as express from "express";
import { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employees.controller";

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.post("/create", createEmployee);
router.put("/update/:id", updateEmployee);
router.delete("/delete/:id", deleteEmployee);

export default router;
