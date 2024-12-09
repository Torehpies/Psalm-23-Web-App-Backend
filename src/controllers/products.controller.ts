import { Request, Response } from "express";
import Products from "../models/Product";

export const getAllProducts = async (_req: Request, res: Response) => {
    try {
        const products = await Products.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await Products.distinct("unit");
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            res.status(404).send("Product not found");
        } else {
            res.status(200).send(product);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = new Products(req.body);
        await newProduct.save();
        res.status(201).send(`Created a new product: ID ${newProduct._id}`);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            res.status(404).send("Product not found");
        } else {
            res.status(200).send(`Updated product: ID ${updatedProduct._id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
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