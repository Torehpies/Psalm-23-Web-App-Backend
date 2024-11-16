import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";

export const stockHistoryRouter = express.Router();
stockHistoryRouter.use(express.json());

stockHistoryRouter.get("/", async (_req, res) => {
    try {
        const stockHistories = await collections.stockHistory?.aggregate([
            {
                $lookup: {
                    from: "ingredientDetails",
                    localField: "ingredient._id",
                    foreignField: "_id",
                    as: "ingredient.details"
                }
            },
            {
                $unwind: "$ingredient.details"
            }
        ]).toArray();
        res.status(200).send(stockHistories);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

stockHistoryRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const stockHistory = await collections.stockHistory?.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "ingredientDetails",
                    localField: "ingredient._id",
                    foreignField: "_id",
                    as: "ingredient.details"
                }
            },
            {
                $unwind: "$ingredient.details"
            }
        ]).toArray();

        if (stockHistory && stockHistory.length > 0) {
            res.status(200).send(stockHistory[0]);
        } else {
            res.status(404).send(`Failed to find a stock history record: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a stock history record: ID ${req.params.id}`);
    }
});

function getCurrentDate(): Date {
    return new Date();
}

function convertToObjectId(id: string): ObjectId {
    return new ObjectId(id);
}

stockHistoryRouter.post("/", async (req, res) => {
    try {
        const stockHistory = req.body;
        if (!stockHistory.Date) {
            stockHistory.Date = getCurrentDate();
        }
        if (stockHistory.EmployeeId) {
            stockHistory.EmployeeId = convertToObjectId(stockHistory.EmployeeId);
        }
        if (stockHistory.ingredient && stockHistory.ingredient._id) {
            stockHistory.ingredient._id = convertToObjectId(stockHistory.ingredient._id);
        }

        const result = await collections.stockHistory?.insertOne(stockHistory);

        if (result?.acknowledged) {
            // Update the referenced ingredient's current stock
            const ingredientId = stockHistory.ingredient._id;
            const quantityToAdd = stockHistory.Quantity;

            const updateResult = await collections.ingredientDetails?.updateOne(
                { _id: ingredientId },
                { $inc: { CurrentStock: quantityToAdd } }
            );

            if (updateResult && typeof updateResult.modifiedCount === 'number' && updateResult.modifiedCount > 0) {
                res.status(201).send(`Created a new stock history record: ID ${result.insertedId} and updated stock for ingredient ID ${ingredientId}.`);
            } else {
                res.status(500).send(`Stock history created but failed to update the stock for ingredient ID ${ingredientId}.`);
            }
        } else {
            res.status(500).send("Failed to create a new stock history record.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});


stockHistoryRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const stockHistory = req.body;
        if (!stockHistory.Date) {
            stockHistory.Date = getCurrentDate();
        }
        if (stockHistory.EmployeeId) {
            stockHistory.EmployeeId = convertToObjectId(stockHistory.EmployeeId);
        }
        if (stockHistory.ingredient && stockHistory.ingredient._id) {
            stockHistory.ingredient._id = convertToObjectId(stockHistory.ingredient._id);
        }
        const query = { _id: new ObjectId(id) };
        const result = await collections.stockHistory?.updateOne(query, { $set: stockHistory });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated stock history record ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a stock history record: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update stock history record ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

stockHistoryRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.stockHistory?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a stock history record: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a stock history record: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a stock history record: ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});
