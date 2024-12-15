import { Request, Response, NextFunction } from "express";
import ProduceHistory from "../models/ProduceHistory";
import Products from "../models/Product";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllProduceHistories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const produceHistories = await ProduceHistory.find({})
            .populate("product", "name")
            .select("product quantity producedAt");
        return next(CreateSuccess(200, "Produce Histories Fetched", produceHistories));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const getProduceHistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const produceHistory = await ProduceHistory.findById(req.params.id)
            .populate("product employee", "name")
            .select("product quantity producedAt");
        if (!produceHistory) {
            return next(CreateError(404, "Produce History not found"));
        } else {
            return next(CreateSuccess(200, "Produce History Fetched", produceHistory));
        }
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const createProduceHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { product, quantity } = req.body;
        const selectedProduct = await Products.findById(product);
        if (!selectedProduct) {
            return next(CreateError(404, "Product not found"));
        }

        const newProduceHistory = new ProduceHistory(req.body);
        await newProduceHistory.save();

        selectedProduct.currentStock += quantity;
        await selectedProduct.save();

        return next(CreateSuccess(201, `Created a new produce history record: ID ${newProduceHistory._id} and updated stock for product ID ${product}.`));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const updateProduceHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { product, quantity } = req.body;
        const produceHistory = await ProduceHistory.findById(req.params.id);
        if (!produceHistory) {
            return next(CreateError(404, "Produce History not found"));
        }

        const selectedProduct = await Products.findById(product);
        if (!selectedProduct) {
            return next(CreateError(404, "Product not found"));
        }

        const quantityDifference = quantity - produceHistory.quantity;
        selectedProduct.currentStock += quantityDifference;
        await selectedProduct.save();

        await ProduceHistory.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        return next(CreateSuccess(200, `Updated produce history record: ID ${req.params.id}`));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const deleteProduceHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const produceHistory = await ProduceHistory.findById(req.params.id);
        if (!produceHistory) {
            return next(CreateError(404, "Produce History not found"));
        }

        const selectedProduct = await Products.findById(produceHistory.product);
        if (selectedProduct) {
            selectedProduct.currentStock -= produceHistory.quantity;
            await selectedProduct.save();
        }

        await ProduceHistory.findByIdAndDelete(req.params.id);
        return next(CreateSuccess(202, `Removed a produce history record: ID ${req.params.id}`));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};