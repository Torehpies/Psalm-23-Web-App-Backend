import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const clockoutRouter = express.Router();
clockoutRouter.use(express.json());

clockoutRouter.get("/", async (_req, res) => {
    console.log("GET /clockouts");
    try {
        const clockouts = await collections?.clockouts?.find({}).toArray();
        res.status(200).send(clockouts);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

clockoutRouter.get("/:id", async (req, res) => {
    console.log(`GET /clockouts/${req.params.id}`);
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const clockout = await collections?.clockouts?.findOne(query);

        if (clockout) {
            res.status(200).send(clockout);
        } else {
            res.status(404).send(`Failed to find a clockout: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a clockout: ID ${req?.params?.id}`);
    }
});

clockoutRouter.post("/", async (req, res) => {
    console.log("POST /clockouts", req.body);
    try {
        const clockout = req.body;
        if (!clockout.ClockoutTime) {
            clockout.ClockoutTime = new Date();
        }
        const result = await collections?.clockouts?.insertOne(clockout);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new clockout: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new clockout.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

clockoutRouter.put("/:id", async (req, res) => {
    console.log(`PUT /clockouts/${req.params.id}`, req.body);
    try {
        const id = req?.params?.id;
        const clockout = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.clockouts?.updateOne(query, { $set: clockout });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a clockout: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a clockout: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a clockout: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

clockoutRouter.delete("/:id", async (req, res) => {
    console.log(`DELETE /clockouts/${req.params.id}`);
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.clockouts?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a clockout: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a clockout: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a clockout: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
