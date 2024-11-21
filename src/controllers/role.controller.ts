import { Request, Response, NextFunction } from 'express';
import Role from "../models/Role";

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.body.role && req.body.role !== ''){
            const newRole = new Role(req.body);
            await newRole.save();
            res.send("Role Created!");
        }else{
            res.status(400).send("Bad Request");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
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
            res.status(200).send("Role Updated");
        }else{
            res.status(404).send("Role not found");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error!");
    }
}

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await Role.find({});
        res.status(200).send(roles);
    } catch (error) {
        res.status(500).send("Internal Server Error!");
    }
}

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findById({_id: req.params.id});
        if(role){
            await Role.findByIdAndDelete(roleId);
            res.status(200).send("Role Deleted");
        }else{
            res.status(400).send("Role not found");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error!");
    }
}