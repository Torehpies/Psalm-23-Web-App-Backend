import { Request, Response, NextFunction } from "express";
import Attendance from "../models/attendance";
import User from "../models/user";

export const getAllAttendances = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const attendances = await Attendance.find({});
        res.status(200).send(attendances);
    } catch (error) {
        next(error);
        return;
    }
};

export const getAttendanceByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendances = await Attendance.find({ userId: req.params.id });
        if (!attendances) {
            res.status(404).send("Attendance not found");
        } else {
            res.status(200).send(attendances);
        }
    } catch (error) {
        next(error);
    }
}

export const getAttendanceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            res.status(404).send("Attendance not found");
        } else {
            res.status(200).send(attendance);
        }
    } catch (error) {
        next(error);
    }
};

export const timeIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;
        // console.log(`Looking for user with ID: ${userId}`);

        const user = await User.findById(userId);
        if (!user) {
            // console.log(`User with ID: ${userId} not found`);
            res.status(404).send("User not found");
        }

        const newAttendance = new Attendance({
            userId: userId,
            TimeIn: req.body.TimeIn,
            workHours: 0
        });

        await newAttendance.save();

        res.status(201).send(`Created a new attendance record with TimeIn: ID ${newAttendance._id}`);
    } catch (error) {
        // console.error(error);
        next(error);
    }
};

export const timeOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            res.status(404).send("Attendance not found")
        }else{

            const timeOut = new Date(req.body.TimeOut);
            attendance.TimeOut = timeOut;
    
            const timeIn = new Date(attendance.TimeIn);
            const workHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60); // Calculate work hours
            attendance.workHours = workHours;
    
            await attendance.save();
    
            const user = await User.findById(attendance.userId);
            if (user) {
                user.totalWorkHours += workHours;
                await user.save();
            }
    
            res.status(200).send(`Updated attendance record with Timeout: ID ${attendance._id}`)
        }

    } catch (error) {
        res.status(500).send("Something went wrong")
    }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return next(res.status(404).send("Attendance not found"));
        }

        if (req.body.TimeIn || req.body.Timeout) {
            const timeIn = req.body.TimeIn ? new Date(req.body.TimeIn) : new Date(attendance.TimeIn);
            const timeOut = req.body.Timeout ? new Date(req.body.Timeout) : attendance.TimeOut ? new Date(attendance.TimeOut) : new Date();
            const workHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60); // Recalculate work hours
            req.body.workHours = workHours;
        }

        const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAttendance) {
            return next(res.status(404).send("Attendance not found"));
        }

        res.status(200).send(`Updated attendance record: ID ${updatedAttendance._id}`);
    } catch (error) {
        next(error);
    }
};

export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Attendance.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Attendance not found");
        } else {
            res.status(202).send(`Removed an attendance record: ID ${req.params.id}`);
        }
    } catch (error) {
        next(error);
    }
};