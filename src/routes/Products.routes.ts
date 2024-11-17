import * as express from "express";
import { collections } from "../database";
import { ObjectId } from "mongodb";

export const productsRouter = express.Router();
productsRouter.use(express.json());

productsRouter.get("/", async (_req, res) => {
    try {
        const products = await collections.products?.find({}).toArray();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

productsRouter.get("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const product = await collections.products?.findOne({ _id: id });

        if (!product) {
            res.status(404).send("Product not found");
        } else {
            res.status(200).send(product);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const result = await collections.products?.insertOne(newProduct);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new product: ID ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new product.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

productsRouter.put("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const updatedProduct = req.body;
        const result = await collections.products?.updateOne({ _id: id }, { $set: updatedProduct });

        if (result?.matchedCount) {
            res.status(200).send(`Updated product: ID ${id}`);
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

productsRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.products?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a product: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a product: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a product: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
