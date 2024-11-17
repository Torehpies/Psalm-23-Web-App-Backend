import * as express from "express";
import Role from '../models/Role';
import { createRole, deleteRole, getAllRoles, updateRole } from "../controllers/role.controller";

const router = express.Router();

router.post("/create", createRole);

router.put("/update/:id", updateRole);

router.get("/getAll", getAllRoles);

router.delete("/deleteRole/:id", deleteRole);

export default router;