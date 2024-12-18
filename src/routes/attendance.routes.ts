import * as express from "express";
import { getAllAttendances, getAttendanceById, timeIn, timeOut, updateAttendance, deleteAttendance } from "../controllers/attendance.controller";

const router = express.Router();

router.get("/", getAllAttendances);
router.get("/:id", getAttendanceById);
router.post("/timein", timeIn);
router.patch("/timeout/:id", timeOut);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

export default router;