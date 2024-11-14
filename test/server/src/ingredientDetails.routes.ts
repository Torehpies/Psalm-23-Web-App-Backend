import * as express from "express";
import { collections } from "./database";
import { ObjectId } from "mongodb";

export const ingredientDetailsRouter = express.Router();
ingredientDetailsRouter.use(express.json());

ingredientDetailsRouter.get("/", async (_req, res) => {
    try {
        const ingredientDetails = await collections.ingredientDetails?.find({}).toArray();
        res.status(200).send(ingredientDetails);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ingredientDetailsRouter.get("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const ingredientDetail = await collections.ingredientDetails?.findOne({ _id: id });

        if (!ingredientDetail) {
            res.status(404).send("Ingredient detail not found");
        } else {
            res.status(200).send(ingredientDetail);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ingredientDetailsRouter.post("/", async (req, res) => {
    try {
        const newIngredientDetail = req.body;
        const result = await collections.ingredientDetails?.insertOne(newIngredientDetail);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new ingredient detail: ID ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create a new ingredient detail.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ingredientDetailsRouter.put("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const updatedIngredientDetail = req.body;
        const result = await collections.ingredientDetails?.updateOne({ _id: id }, { $set: updatedIngredientDetail });

        if (result?.matchedCount) {
            res.status(200).send(`Updated ingredient detail: ID ${id}`);
        } else {
            res.status (404).send("Ingredient detail not found");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ingredientDetailsRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.ingredientDetails?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an ingredient detail: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an ingredient detail: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an ingredient detail: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
