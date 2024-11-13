import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { IngredientDetails } from "./ingredientDetails"; // Import IngredientDetails

export const ingredientDetailsRouter = express.Router();
ingredientDetailsRouter.use(express.json());

function getCurrentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

ingredientDetailsRouter.get("/", async (_req, res) => {
    console.log("GET /ingredientDetails");
    try {
        const ingredientDetailsRecords = await collections.ingredientDetails?.find({}).toArray();
        res.status(200).send(ingredientDetailsRecords);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ingredientDetailsRouter.get("/:id", async (req, res) => {
    console.log(`GET /ingredientDetails/${req.params.id}`);
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const ingredientDetailsRecord = await collections.ingredientDetails?.findOne(query);

        if (ingredientDetailsRecord) {
            res.status(200).send(ingredientDetailsRecord);
        } else {
            res.status(404).send(`Failed to find an ingredient details record: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an ingredient details record: ID ${req.params.id}`);
    }
});

ingredientDetailsRouter.post("/", async (req, res) => {
    console.log("POST /ingredientDetails", req.body);
    try {
        const ingredientDetailsRecord: IngredientDetails = req.body;
        if (Array.isArray(ingredientDetailsRecord.StockHistory)) {
            ingredientDetailsRecord.StockHistory.forEach((record) => {
                if (!record.Date) {
                    record.Date = getCurrentDate();
                }
            });
        } else {
            ingredientDetailsRecord.StockHistory = [{
                Date: getCurrentDate(),
                Price: 0,
                Quantity: 0,
                EmployeeId: ""
            }];
        }
        const result = await collections.ingredientDetails?.insertOne(ingredientDetailsRecord);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new ingredient details record: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new ingredient details record.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ingredientDetailsRouter.post("/:id/stockhistory", async (req, res) => {
    console.log(`POST /ingredientDetails/${req.params.id}/stockhistory`, req.body);
    try {
        const id = req.params.id;
        const newStockHistory = req.body; 
        if (!newStockHistory.Date) {
            newStockHistory.Date = getCurrentDate();
        }
        const query = { _id: new ObjectId(id) };
        const update = { $push: { StockHistory: newStockHistory }, $inc: { CurrentStock: newStockHistory.Quantity } };
        const result = await collections.ingredientDetails?.updateOne(query, update);

        if (result && result.matchedCount) {
            res.status(200).send(`Added new stock history for record ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an ingredient details record: ID ${id}`);
        } else {
            res.status(304).send(`Failed to add new stock history for record ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

ingredientDetailsRouter.put("/:id", async (req, res) => {
    console.log(`PUT /ingredientDetails/${req.params.id}`, req.body);
    try {
        const id = req.params.id;
        const updatedIngredientDetails: IngredientDetails = req.body;
        const query = { _id: new ObjectId(id) };
        const update = { $set: updatedIngredientDetails };
        const result = await collections.ingredientDetails?.updateOne(query, update);

        if (result && result.matchedCount) {
            res.status(200).send(`Updated ingredient details for record ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an ingredient details record: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update ingredient details for record ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

ingredientDetailsRouter.delete("/:id", async (req, res) => {
    console.log(`DELETE /ingredientDetails/${req.params.id}`);
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.ingredientDetails?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an ingredient details record: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an ingredient details record: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an ingredient details record: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
