import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const productDescriptionRouter = express.Router();
productDescriptionRouter.use(express.json());

productDescriptionRouter.get("/", async (_req, res) => {
    console.log("GET /productdescriptions");
    try {
        const productDescriptions = await collections?.productDescriptions?.find({}).toArray();
        res.status(200).send(productDescriptions);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

productDescriptionRouter.get("/:id", async (req, res) => {
    console.log(`GET /productdescriptions/${req.params.id}`);
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const productDescription = await collections?.productDescriptions?.findOne(query);

        if (productDescription) {
            res.status(200).send(productDescription);
        } else {
            res.status(404).send(`Failed to find a product description: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a product description: ID ${req?.params?.id}`);
    }
});

productDescriptionRouter.post("/", async (req, res) => {
    console.log("POST /productdescriptions", req.body);
    try {
        const productDescription = req.body;
        if (!productDescription.Description.DateStocked) {
            productDescription.Description.DateStocked = new Date();
        }
        const result = await collections?.productDescriptions?.insertOne(productDescription);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new product description: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new product description.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

productDescriptionRouter.put("/:id", async (req, res) => {
    console.log(`PUT /productdescriptions/${req.params.id}`, req.body);
    try {
        const id = req?.params?.id;
        let { ExpirationDate } = req.body.Description;
        if (ExpirationDate) {
            ExpirationDate = new Date(ExpirationDate).toISOString();
        } else {
            ExpirationDate = new Date().toISOString();
        }
        const query = { _id: new ObjectId(id) };
        const update = { $set: { "Description.ExpirationDate": ExpirationDate } };
        const result = await collections?.productDescriptions?.updateOne(query, update);

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a product description: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a product description: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a product description: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

productDescriptionRouter.delete("/:id", async (req, res) => {
    console.log(`DELETE /productdescriptions/${req.params.id}`);
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.productDescriptions?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a product description: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a product description: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a product description: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
