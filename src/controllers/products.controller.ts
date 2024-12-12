import { NextFunction, Request, Response } from "express";
import Products from "../models/Product";
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Products.find({});
        return next(CreateSuccess(200, "All Products fetched", products));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Products.distinct("unit");
        return next(CreateSuccess(200, "All Categories fetched", categories));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return next(CreateError(404, "Product not found"));
        } else {
            return next(CreateSuccess(200, "Product fetched", product));
        }
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newProduct = new Products(req.body);
        await newProduct.save();
        res.status(201).send(`Created a new product: ID ${newProduct._id}`);
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            res.status(404).send("Product not found");
        } else {
            res.status(200).send(`Updated product: ID ${updatedProduct._id}`);
        }
    } catch (error) {
        return next(CreateError(400, "Unknown Error"));
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Products.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Product not found");
        } else {
            res.status(202).send(`Removed a product: ID ${req.params.id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};