import { Request, Response, NextFunction } from "express";
import Attendance from "../models/attendance";
import User from "../models/user";

export const getAllAttendances = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const attendances = await Attendance.find({});
        res.status(200).send(attendances);
    } catch (error) {
        next(error);
    }
};

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

export const createAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;
        // console.log(`Looking for user with ID: ${userId}`);

        const user = await User.findById(userId);
        if (!user) {
            // console.log(`User with ID: ${userId} not found`);
            return next(res.status(404).send("User not found"));
        }

        const newAttendance = new Attendance(req.body);
        await newAttendance.save();

        const [inHours, inMinutes] = newAttendance.TimeIn.split(':').map(Number);
        const [outHours, outMinutes] = newAttendance.Timeout.split(':').map(Number);
        const timeInMinutes = inHours * 60 + inMinutes;
        let timeOutMinutes = outHours * 60 + outMinutes;
        if (timeOutMinutes <= timeInMinutes) {
            timeOutMinutes += 24 * 60; // Adjust for times past midnight or exactly at midnight
        }
        const workHours = (timeOutMinutes - timeInMinutes) / 60;
        user.totalWorkHours += workHours;
        await user.save();

        return next(res.status(201).send(`Created a new attendance record: ID ${newAttendance._id}`));
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attendance) {
            res.status(404).send("Attendance not found");
        } else {
            res.status(200).send(`Updated attendance record: ID ${attendance._id}`);
        }
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