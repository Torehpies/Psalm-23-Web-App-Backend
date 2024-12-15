import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllUnapprovedUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ isApproved: false }).select("firstName lastName role");
        return next(CreateSuccess(200, "All unapproved users fetched successfully", users));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        user.isApproved = true;
        await user.save();
        return next(CreateSuccess(200, "User approved successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}