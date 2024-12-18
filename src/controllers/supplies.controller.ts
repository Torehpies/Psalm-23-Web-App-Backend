import { Request, Response, NextFunction } from "express";
import Supplies from "../models/supplies";

export const getAllSupplies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplies = await Supplies.find({});
        res.status(200).send(supplies);
    } catch (error) {
        res.status(500).send("Error in fetching supplies");
        // console.error(error);
    }
};

export const getSupplyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supply = await Supplies.findById(req.params.id);
        if (!supply) {
            res.status(404).send("Supply not found");
        } else {
            res.status(200).send(supply);
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const createSupply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.name && req.body.category && req.body.currentStock !== undefined && req.body.unit && req.body.par !== undefined) {
            const newSupply = new Supplies(req.body);
            await newSupply.save();
            res.status(201).send(`Created a new supply: ID ${newSupply._id}`);
        } else {
            res.status(400).send("Bad Request");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const updateSupply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supply = await Supplies.findById(req.params.id);
        if (supply) {
            await Supplies.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).send("Supply Updated");
        } else {
            res.status(404).send("Supply not found");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const deleteSupply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supply = await Supplies.findById(req.params.id);
        if (supply) {
            await Supplies.findByIdAndDelete(req.params.id);
            res.status(200).send("Supply Deleted");
        } else {
            res.status(404).send("Supply not found");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};