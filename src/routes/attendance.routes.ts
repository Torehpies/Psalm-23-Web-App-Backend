
import * as express from "express";
import { getAllAttendances, getAttendanceById, createAttendance, updateAttendance, deleteAttendance } from "../controllers/attendance.controller";

const router = express.Router();

router.get("/", getAllAttendances);
router.get("/:id", getAttendanceById);
router.post("/create", createAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

export default router;