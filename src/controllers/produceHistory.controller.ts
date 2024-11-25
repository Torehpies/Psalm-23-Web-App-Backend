import { Request, Response } from "express";
import ProduceHistory from "../models/ProduceHistory";
import Products from "../models/Products";

export const getAllProduceHistories = async (_req: Request, res: Response) => {
    try {
        const produceHistories = await ProduceHistory.find({}).populate('product._id');
        res.status(200).send(produceHistories);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getProduceHistoryById = async (req: Request, res: Response) => {
    try {
        const produceHistory = await ProduceHistory.findById(req.params.id).populate('product._id');
        if (!produceHistory) {
            res.status(404).send("Produce history not found");
        } else {
            res.status(200).send(produceHistory);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const createProduceHistory = async (req: Request, res: Response) => {
    try {
        const newProduceHistory = new ProduceHistory(req.body);
        await newProduceHistory.save();

        // Update the referenced product's current stock
        if (!newProduceHistory.product) {
            return res.status(400).send("Product is missing in the produce history.");
        }
        const productId = newProduceHistory.product._id;
        const quantityToAdd = newProduceHistory.Quantity;

        const updateResult = await Products.findByIdAndUpdate(
            productId,
            { $inc: { CurrentStock: quantityToAdd } },
            { new: true }
        );

        if (updateResult) {
            res.status(201).send(`Created a new produce history record: ID ${newProduceHistory._id} and updated stock for product ID ${productId}.`);
        } else {
            res.status(500).send(`Produce history created but failed to update the stock for product ID ${productId}.`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateProduceHistory = async (req: Request, res: Response) => {
    try {
        const updatedProduceHistory = await ProduceHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduceHistory) {
            res.status(404).send("Produce history not found");
        } else {
            res.status(200).send(`Updated produce history record: ID ${updatedProduceHistory._id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteProduceHistory = async (req: Request, res: Response) => {
    try {
        const result = await ProduceHistory.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Produce history not found");
        } else {
            res.status(202).send(`Removed a produce history record: ID ${req.params.id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};