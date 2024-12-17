import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllUnapprovedUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ status: "pending" }).select("_id firstName lastName role email");
        return next(CreateSuccess(200, "All unapproved users fetched successfully", users));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const getAllApprovedUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ status: "approved" }).select("_id firstName lastName role email");
        return next(CreateSuccess(200, "All approved users fetched successfully", users));
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
        if (user.status === 'disabled') {
            return next(CreateError(403, "User is disabled and cannot be approved"));
        }
        user.status = 'approved';
        await user.save();
        return next(CreateSuccess(200, "User approved successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const disableAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        user.status = 'disabled';
        await user.save();
        return next(CreateSuccess(200, "User account disabled successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const rejectAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        user.status = 'rejected';
        await user.save();
        return next(CreateSuccess(200, "User account rejected successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        const { firstName, lastName, role, email, status } = req.body;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (role) user.role = role;
        if (email) user.email = email;
        if (status) user.status = status;

        await user.save();
        return next(CreateSuccess(200, "User account updated successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        return next(CreateSuccess(200, "User account deleted successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

