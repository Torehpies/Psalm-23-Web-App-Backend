
import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";

export const produceHistoryRouter = express.Router();
produceHistoryRouter.use(express.json());

produceHistoryRouter.get("/", async (_req, res) => {
    try {
        const produceHistories = await collections.produceHistory?.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "product._id",
                    foreignField: "_id",
                    as: "product.details"
                }
            },
            {
                $unwind: "$product.details"
            }
        ]).toArray();
        res.status(200).send(produceHistories);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

produceHistoryRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const produceHistory = await collections.produceHistory?.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "products",
                    localField: "product._id",
                    foreignField: "_id",
                    as: "product.details"
                }
            },
            {
                $unwind: "$product.details"
            }
        ]).toArray();

        if (produceHistory && produceHistory.length > 0) {
            res.status(200).send(produceHistory[0]);
        } else {
            res.status(404).send(`Failed to find a produce history record: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a produce history record: ID ${req.params.id}`);
    }
});

function getCurrentDate(): Date {
    return new Date();
}

function convertToObjectId(id: string): ObjectId {
    return new ObjectId(id);
}

produceHistoryRouter.post("/", async (req, res) => {
    try {
        const produceHistory = req.body;
        if (!produceHistory.Date) {
            produceHistory.Date = getCurrentDate();
        }
        if (produceHistory.EmployeeId) {
            produceHistory.EmployeeId = convertToObjectId(produceHistory.EmployeeId);
        }
        if (produceHistory.product && produceHistory.product._id) {
            produceHistory.product._id = convertToObjectId(produceHistory.product._id);
        }

        const result = await collections.produceHistory?.insertOne(produceHistory);

        if (result?.acknowledged) {
            // Update the referenced product's current stock
            const productId = produceHistory.product._id;
            const quantityToAdd = produceHistory.Quantity;

            const updateResult = await collections.products?.updateOne(
                { _id: productId },
                { $inc: { CurrentStock: quantityToAdd } }
            );

            if (updateResult && typeof updateResult.modifiedCount === 'number' && updateResult.modifiedCount > 0) {
                res.status(201).send(`Created a new produce history record: ID ${result.insertedId} and updated stock for product ID ${productId}.`);
            } else {
                res.status(500).send(`Produce history created but failed to update the stock for product ID ${productId}.`);
            }
        } else {
            res.status(500).send("Failed to create a new produce history record.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

produceHistoryRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const produceHistory = req.body;
        if (!produceHistory.Date) {
            produceHistory.Date = getCurrentDate();
        }
        if (produceHistory.EmployeeId) {
            produceHistory.EmployeeId = convertToObjectId(produceHistory.EmployeeId);
        }
        if (produceHistory.product && produceHistory.product._id) {
            produceHistory.product._id = convertToObjectId(produceHistory.product._id);
        }
        const query = { _id: new ObjectId(id) };
        const result = await collections.produceHistory?.updateOne(query, { $set: produceHistory });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated produce history record ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a produce history record: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update produce history record ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

produceHistoryRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.produceHistory?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a produce history record: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a produce history record: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a produce history record: ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});