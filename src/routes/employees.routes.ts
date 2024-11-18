import * as express from "express";
import { getAllEmployees, getEmployeeById, createEmployee, updateEmployeeAttendance, deleteEmployee } from "../controllers/employees.controller";

export const employeesRouter = express.Router();
employeesRouter.use(express.json());

employeesRouter.get("/", getAllEmployees);
employeesRouter.get("/:id", getEmployeeById);
employeesRouter.post("/", createEmployee);
employeesRouter.put("/:id/attendance", updateEmployeeAttendance);
employeesRouter.delete("/:id", deleteEmployee);
