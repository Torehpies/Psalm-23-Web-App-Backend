
import { Request, Response } from "express";
import StockHistory from "../models/StockHistory";
import Supplies from "../models/supplies";

export const getAllStockHistory = async (_req: Request, res: Response) => {
    try {
        const stockHistories = await StockHistory.find({}).populate("ingredient._id");
        res.status(200).send(stockHistories);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getStockHistoryById = async (req: Request, res: Response) => {
    try {
        const stockHistory = await StockHistory.findById(req.params.id).populate("ingredient._id");
        if (!stockHistory) {
            res.status(404).send("Stock history not found");
        } else {
            res.status(200).send(stockHistory);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const createStockHistory = async (req: Request, res: Response) => {
    try {
        const newStockHistory = new StockHistory(req.body);
        await newStockHistory.save();

        // Update the referenced ingredient's current stock
        if (!newStockHistory.ingredient) {
            return res.status(400).send("Ingredient is missing in the stock history.");
        }
        const ingredientId = newStockHistory.ingredient._id;
        const quantityToAdd = newStockHistory.Quantity;

        const updateResult = await Supplies.findByIdAndUpdate(
            ingredientId,
            { $inc: { CurrentStock: quantityToAdd } },
            { new: true }
        );

        if (updateResult) {
            res.status(201).send(`Created a new stock history record: ID ${newStockHistory._id} and updated stock for ingredient ID ${ingredientId}.`);
        } else {
            res.status(500).send(`Stock history created but failed to update the stock for ingredient ID ${ingredientId}.`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateStockHistory = async (req: Request, res: Response) => {
    try {
        const updatedStockHistory = await StockHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStockHistory) {
            res.status(404).send("Stock history not found");
        } else {
            res.status(200).send(`Updated stock history: ID ${updatedStockHistory._id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteStockHistory = async (req: Request, res: Response) => {
    try {
        const result = await StockHistory.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Stock history not found");
        } else {
            res.status(202).send(`Removed a stock history record: ID ${req.params.id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};