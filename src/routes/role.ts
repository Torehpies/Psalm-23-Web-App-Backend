import * as express from "express";
import Role from '../models/Role';

export const roleRouter = express.Router();

roleRouter.post("/create", async (req, res) => {
    try {
        if(req.body.role && req.body.role !== ''){
            const newRole = new Role(req.body);
            await newRole.save();
            res.send("Role Created!");
        }else{
            res.status(400).send("Bad Request");
        }
    } catch (error) {
        res.status(500).send(console.log(error));
    }
});