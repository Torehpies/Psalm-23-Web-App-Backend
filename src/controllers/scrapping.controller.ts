import { Request, Response, NextFunction } from "express";
import Scrapping from "../models/scrapping";
import Products from "../models/Products";

export const getAllScrapping = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scrapping = await Scrapping.find({}).populate("supply employee");
        res.status(200).send(scrapping);
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const getScrappingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scrapping = await Scrapping.findById(req.params.id).populate("supply employee");
        if (!scrapping) {
            res.status(404).send("Scrapping not found");
        } else {
            res.status(200).send(scrapping);
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const createScrapping = async (req: Request, res: Response) => {
    try {
        const { supply, Quantity } = req.body;
        const selectedProduct = await Products.findById(supply);
        if (!selectedProduct) {
            return res.status(404).send("Product not found");
        }
        if (selectedProduct.currentStock < Quantity) {
            return res.status(400).send("Insufficient stock");
        }
        selectedProduct.currentStock -= Quantity;
        await selectedProduct.save();

        const newScrapping = new Scrapping(req.body);
        await newScrapping.save();
        res.status(201).send(`Created a new scrapping: ID ${newScrapping._id}`);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateScrapping = async (req: Request, res: Response) => {
    try {
        const scrapping = await Scrapping.findById(req.params.id);
        if (!scrapping) {
            return res.status(404).send("Scrapping not found");
        }

        const { supply, Quantity } = req.body;
        const selectedProduct = await Products.findById(supply);
        if (!selectedProduct) {
            return res.status(404).send("Product not found");
        }

        const quantityDifference = Quantity - scrapping.Quantity;
        if (selectedProduct.currentStock < quantityDifference) {
            return res.status(400).send("Insufficient stock");
        }
        selectedProduct.currentStock -= quantityDifference;
        await selectedProduct.save();

        await Scrapping.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).send("Scrapping Updated");
    } catch (error) {
        res.status (500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteScrapping = async (req: Request, res: Response) => {
    try {
        const scrapping = await Scrapping.findById(req.params.id);
        if (scrapping) {
            await Scrapping.findByIdAndDelete(req.params.id);
            res.status(200).send("Scrapping Deleted");
        } else {
            res.status(404).send("Scrapping not found");
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};
