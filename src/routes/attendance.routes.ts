import * as express from "express";
import { getAllAttendances, getAttendanceById, timeIn, timeOut, updateAttendance, deleteAttendance, getAttendanceByUserId } from "../controllers/attendance.controller";

const router = express.Router();

router.get("/", getAllAttendances);
router.get("/user/:id", getAttendanceByUserId);
router.get("/:id", getAttendanceById);
router.post("/timein", timeIn);
router.patch("/timeout/:id", timeOut);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

export default router;