
import * as express from "express";
import { collections } from "../database";
import { ObjectId } from "mongodb";

export const suppliesRouter = express.Router();
suppliesRouter.use(express.json());

suppliesRouter.get("/", async (_req, res) => {
    try {
        const supplies = await collections.supplies?.find({}).toArray();
        res.status(200).send(supplies);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

suppliesRouter.get("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const supply = await collections.supplies?.findOne({ _id: id });

        if (!supply) {
            res.status(404).send("Supply not found");
        } else {
            res.status(200).send(supply);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

suppliesRouter.post("/", async (req, res) => {
    try {
        const newSupply = req.body;
        const result = await collections.supplies?.insertOne(newSupply);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new supply: ID ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new supply.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

suppliesRouter.put("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const updatedSupply = req.body;
        const result = await collections.supplies?.updateOne({ _id: id }, { $set: updatedSupply });

        if (result?.matchedCount) {
            res.status(200).send(`Updated supply: ID ${id}`);
        } else {
            res.status(404).send("Supply not found");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

suppliesRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.supplies?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a supply: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a supply: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a supply: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});