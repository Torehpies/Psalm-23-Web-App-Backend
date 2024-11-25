import { Request, Response, NextFunction } from 'express';
import Role from "../models/Role";
import { CreateSuccess } from '../utils/success';
import { CreateError } from '../utils/error';

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.body.role && req.body.role !== ''){
            const newRole = new Role(req.body);
            await newRole.save();
			return next(CreateSuccess(200, "Role Created"))
        }else{
			return next(CreateError(400, "Bad Request"))
        }
    } catch (error) {
		return next(CreateError(500, "Internal Server Error"));
    }
}

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await Role.findById({_id: req.params.id});
        if(role) {
            const newData = await Role.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true}
            );
			return next(CreateSuccess(200, "Role Updated"))
        }else{
			return next(CreateError(404, "Role not found"));
        }
    } catch (error) {
		return next(CreateError(500, "Internal Server Error!"));
    }
}

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await Role.find({});
		return next(CreateSuccess(200, "Role Updated", roles))
    } catch (error) {
		return next(CreateError(500, "Internal Server Error!"));
    }
}

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findById({_id: req.params.id});
        if(role){
            await Role.findByIdAndDelete(roleId);
			return next(CreateSuccess(200, "Role Deleted"))
        }else{
			return next(CreateError(400, "Role not found"));
        }
    } catch (error) {
		return next(CreateError(500, "Internal Server Error!"));
    }
}
