import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";

export const employeesRouter = express.Router();
employeesRouter.use(express.json());

function calculateTotalWorkHours(attendance: { TimeIn?: string; Timeout?: string }[]): number {
    let totalMinutes = 0;
    attendance.forEach(record => {
        if (record.TimeIn && record.Timeout) {
            const [inHours, inMinutes] = record.TimeIn.split(':').map(Number);
            const [outHours, outMinutes] = record.Timeout.split(':').map(Number);
            const timeInMinutes = inHours * 60 + inMinutes;
            let timeOutMinutes = outHours * 60 + outMinutes;
            if (timeOutMinutes <= timeInMinutes) {
                timeOutMinutes += 24 * 60; // Adjust for times past midnight or exactly at midnight
            }
            totalMinutes += timeOutMinutes - timeInMinutes;
        }
    });
    return totalMinutes / 60; 
}

function getCurrentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatTimeToHHMM(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

employeesRouter.get("/", async (_req, res) => {
    console.log("GET /employees");
    try {
        const attendanceRecords = await collections.employees?.find({}).toArray();
        res.status(200).send(attendanceRecords);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

employeesRouter.get("/:id", async (req, res) => {
    console.log(`GET /employees/${req.params.id}`);
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const attendanceRecord = await collections.employees?.findOne(query);

        if (attendanceRecord) {
            res.status(200).send(attendanceRecord);
        } else {
            res.status(404).send(`Failed to find an attendance record: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an attendance record: ID ${req.params.id}`);
    }
});

employeesRouter.post("/", async (req, res) => {
    console.log("POST /employees", req.body);
    try {
        const attendanceRecord = req.body;
        if (Array.isArray(attendanceRecord.Attendance)) {
            attendanceRecord.Attendance.forEach((record: { Date?: Date, TimeIn?: string, Timeout?: string }) => {
                if (!record.Date) {
                    record.Date = getCurrentDate();
                }
                if (record.TimeIn) {
                    record.TimeIn = formatTimeToHHMM(record.TimeIn);
                }
                if (record.Timeout) {
                    record.Timeout = formatTimeToHHMM(record.Timeout);
                }
            });
            attendanceRecord.TotalWorkHours = calculateTotalWorkHours(attendanceRecord.Attendance);
        } else {
            attendanceRecord.Attendance = [];
            attendanceRecord.TotalWorkHours = 0;
        }
        const result = await collections.employees?.insertOne(attendanceRecord);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new attendance record: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new attendance record.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

employeesRouter.put("/:id/attendance", async (req, res) => {
    console.log(`PUT /employees/${req.params.id}/attendance`, req.body);
    try {
        const id = req.params.id;
        const newAttendance = req.body.Attendance[0]; 
        if (!newAttendance.Date) {
            newAttendance.Date = getCurrentDate();
        }
        if (newAttendance.TimeIn) {
            newAttendance.TimeIn = formatTimeToHHMM(newAttendance.TimeIn);
        }
        if (newAttendance.Timeout) {
            newAttendance.Timeout = formatTimeToHHMM(newAttendance.Timeout);
        }
        const query = { _id: new ObjectId(id) };
        const update = { $push: { Attendance: newAttendance } };
        const result = await collections.employees?.updateOne(query, update);

        if (result && result.matchedCount) {
            const updatedRecord = await collections.employees?.findOne(query);
            if (updatedRecord) {
                const totalWorkHours = calculateTotalWorkHours(updatedRecord.Attendance);
                await collections.employees?.updateOne(query, { $set: { TotalWorkHours: totalWorkHours } });
            }
            res.status(200).send(`Updated attendance for record ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an attendance record: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update attendance for record ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

employeesRouter.post("/:id/attendance", async (req, res) => {
    console.log(`POST /employees/${req.params.id}/attendance`, req.body);
    try {
        const id = req.params.id;
        const newAttendance = req.body;
        if (!newAttendance.Date) {
            newAttendance.Date = getCurrentDate();
        }
        if (newAttendance.TimeIn) {
            newAttendance.TimeIn = formatTimeToHHMM(newAttendance.TimeIn);
        }
        if (newAttendance.Timeout) {
            newAttendance.Timeout = formatTimeToHHMM(newAttendance.Timeout);
        }
        const query = { _id: new ObjectId(id) };
        const update = { $push: { Attendance: newAttendance } };
        const result = await collections.employees?.updateOne(query, update);

        if (result && result.matchedCount) {
            const updatedRecord = await collections.employees?.findOne(query);
            if (updatedRecord) {
                const totalWorkHours = calculateTotalWorkHours(updatedRecord.Attendance);
                await collections.employees?.updateOne(query, { $set: { TotalWorkHours: totalWorkHours } });
            }
            res.status(200).send(`Added new attendance for record ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an attendance record: ID ${id}`);
        } else {
            res.status(304).send(`Failed to add new attendance for record ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

employeesRouter.delete("/:id", async (req, res) => {
    console.log(`DELETE /employees/${req.params.id}`);
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.employees?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an attendance record: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an attendance record: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an attendance record: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
