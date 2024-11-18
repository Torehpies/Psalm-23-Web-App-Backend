
import { Request, Response } from "express";
import Employee from "../models/employees";

export const getAllEmployees = async (_req: Request, res: Response) => {
    try {
        const employees = await Employee.find({});
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            res.status(404).send("Employee not found");
        } else {
            res.status(200).send(employee);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).send(`Created a new employee: ID ${newEmployee._id}`);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateEmployeeAttendance = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            res.status(404).send("Employee not found");
            return;
        }

        const newAttendance = req.body.Attendance[0];
        if (!newAttendance.Date) {
            newAttendance.Date = new Date();
        }
        employee.Attendance.push(newAttendance);
        employee.TotalWorkHours = calculateTotalWorkHours(employee.Attendance);

        await employee.save();
        res.status(200).send(`Updated attendance for employee ID ${employee._id}`);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const result = await Employee.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Employee not found");
        } else {
            res.status(202).send(`Removed an employee: ID ${req.params.id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

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