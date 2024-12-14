import { Request, Response, NextFunction } from "express";
import UsedSupplies from "../models/usedSupplies";
import Supplies from "../models/supplies";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllUsedSupplies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usedSupplies = await UsedSupplies.find({})
            .populate("supply", "name")
            .select("supply quantity usedAt");
        res.status(200).send(usedSupplies);
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const getUsedSupplyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usedSupply = await UsedSupplies.findById(req.params.id)
            .populate("supply employee", "name")
            .select("supply quantity usedAt");
        if (!usedSupply) {
            res.status(404).send("Used Supply not found");
        } else {
            res.status(200).send(usedSupply);
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const createUsedSupply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { supply, quantity } = req.body;
        const selectedSupply = await Supplies.findById(supply);
        if (!selectedSupply) {
            return next(CreateError(404, "Supply not found"));
        }
        if (selectedSupply.currentStock < quantity) {
            return next(CreateError(400, "Insufficient stock"));
        }
        selectedSupply.currentStock -= quantity;
        await selectedSupply.save();
        
        const newUsedSupply = new UsedSupplies(req.body);
        await newUsedSupply.save();
        return next(CreateSuccess(201, `Created a new used supply: ID ${newUsedSupply._id}`));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const updateUsedSupply = async (req: Request, res: Response) => {
    try {
        const usedSupply = await UsedSupplies.findById(req.params.id);
        if (!usedSupply) {
            return res.status(404).send("Used Supply not found");
        }

        const { supply, quantity } = req.body;
        const selectedSupply = await Supplies.findById(supply);
        if (!selectedSupply) {
            return res.status(404).send("Supply not found");
        }

        const quantityDifference = quantity - usedSupply.quantity;
        if (selectedSupply.currentStock < quantityDifference) {
            return res.status(400).send("Insufficient stock");
        }
        selectedSupply.currentStock -= quantityDifference;
        await selectedSupply.save();

        await UsedSupplies.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).send("Used Supply Updated");
    } catch (error) {
        res.status (500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteUsedSupply = async (req: Request, res: Response) => {
    try {
        const usedSupply = await UsedSupplies.findById(req.params.id);
        if (usedSupply) {
            await UsedSupplies.findByIdAndDelete(req.params.id);
            res.status(200).send("Used Supply Deleted");
        } else {
            res.status(404).send("Used Supply not found");
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};
