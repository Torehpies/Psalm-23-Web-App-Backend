import { Request, Response, NextFunction } from "express";
import Employee from "../models/employees";

export const getAllEmployees = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await Employee.find({});
        res.status(200).send(employees);
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            res.status(404).send("Employee not found");
        } else {
            res.status(200).send(employee);
        }
    } catch (error) {
        next(error);
    }
};

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).send(`Created a new employee: ID ${newEmployee._id}`);
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) {
            res.status(404).send("Employee not found");
        } else {
            res.status(200).send(`Updated employee: ID ${employee._id}`);
        }
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Employee.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Employee not found");
        } else {
            res.status(202).send(`Removed an employee: ID ${req.params.id}`);
        }
    } catch (error) {
        next(error);
    }
};