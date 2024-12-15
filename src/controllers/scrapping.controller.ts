import { Request, Response, NextFunction } from "express";
import Scrapping from "../models/scrapping";
import Products from "../models/Product";
import Supplies from "../models/supplies";
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";

export const getAllScrapping = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scrapping = await Scrapping.find({}).select("itemId itemName itemType quantity usedAt employee");
        return next(CreateSuccess(200, "Scrapping retrieved", scrapping));
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error);
    }
};

export const getScrappingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scrapping = await Scrapping.findById(req.params.id).select("itemId itemName itemType quantity usedAt employee");
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

export const createScrapping = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId, itemName, itemType, quantity, usedAt, employee } = req.body;
        let selectedItem;

        if (itemType === "Products") {
            selectedItem = await Products.findById(itemId);
        } else if (itemType === "Supplies") {
            selectedItem = await Supplies.findById(itemId);
        } else {
            return next(CreateError(400, "Invalid item type"));
        }

        if (!selectedItem) {
            return next(CreateError(404, "Item not found"));
        }
        if (selectedItem.currentStock < quantity) {
            return next(CreateError(400, "Insufficient stock"));
        }
        selectedItem.currentStock -= quantity;
        await selectedItem.save();

        const newScrapping = new Scrapping({
            itemId: selectedItem._id,
            itemName: selectedItem.name,
            itemType,
            quantity,
            usedAt,
            employee
        });
        await newScrapping.save();
        return next(CreateSuccess(200, "Created new scrapping", newScrapping));
    } catch (error) {
        console.error("Error creating scrapping:", error);
        return next(CreateError(500, `Failed to create ${error}`));
    }
};

export const updateScrapping = async (req: Request, res: Response) => {
    try {
        const scrapping = await Scrapping.findById(req.params.id);
        if (!scrapping) {
            return res.status(404).send("Scrapping not found");
        }

        const { item, itemType, quantity, usedAt, employee } = req.body;
        let selectedItem;

        if (itemType === 'Products') {
            selectedItem = await Products.findById(item);
        } else if (itemType === 'Supplies') {
            selectedItem = await Supplies.findById(item);
        }

        if (!selectedItem) {
            return res.status(404).send(`${itemType} not found`);
        }

        const quantityDifference = quantity - scrapping.quantity;
        if (selectedItem.currentStock < quantityDifference) {
            return res.status(400).send("Insufficient stock");
        }
        selectedItem.currentStock -= quantityDifference;
        await selectedItem.save();

        await Scrapping.findByIdAndUpdate(req.params.id, {
            itemId: selectedItem._id,
            itemName: selectedItem.name,
            itemType,
            quantity,
            usedAt,
            employee
        }, { new: true });
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
