import { Request, Response, NextFunction } from "express";
import UsedSupplies from "../models/usedSupplies";
import Supplies from "../models/supplies";

export const getAllUsedSupplies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usedSupplies = await UsedSupplies.find({}).populate("supply employee");
        res.status(200).send(usedSupplies);
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const getUsedSupplyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usedSupply = await UsedSupplies.findById(req.params.id).populate("supply employee");
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

export const createUsedSupply = async (req: Request, res: Response) => {
    try {
        const { supply, Quantity } = req.body;
        const selectedSupply = await Supplies.findById(supply);
        if (!selectedSupply) {
            return res.status(404).send("Supply not found");
        }
        if (selectedSupply.currentStock < Quantity) {
            return res.status(400).send("Insufficient stock");
        }
        selectedSupply.currentStock -= Quantity;
        await selectedSupply.save();

        const newUsedSupply = new UsedSupplies(req.body);
        await newUsedSupply.save();
        res.status(201).send(`Created a new used supply: ID ${newUsedSupply._id}`);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateUsedSupply = async (req: Request, res: Response) => {
    try {
        const usedSupply = await UsedSupplies.findById(req.params.id);
        if (!usedSupply) {
            return res.status(404).send("Used Supply not found");
        }

        const { supply, Quantity } = req.body;
        const selectedSupply = await Supplies.findById(supply);
        if (!selectedSupply) {
            return res.status(404).send("Supply not found");
        }

        const quantityDifference = Quantity - usedSupply.Quantity;
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
