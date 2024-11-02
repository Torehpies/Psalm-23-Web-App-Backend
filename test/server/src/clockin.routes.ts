import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const clockinRouter = express.Router();
clockinRouter.use(express.json());

clockinRouter.get("/", async (_req, res) => {
    console.log("GET /clockins");
    try {
        const clockins = await collections?.clockins?.find({}).toArray();
        res.status(200).send(clockins);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

clockinRouter.get("/:id", async (req, res) => {
    console.log(`GET /clockins/${req.params.id}`); 
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const clockin = await collections?.clockins?.findOne(query);

        if (clockin) {
            res.status(200).send(clockin);
        } else {
            res.status(404).send(`Failed to find a clockin: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a clockin: ID ${req?.params?.id}`);
    }
});

clockinRouter.post("/", async (req, res) => {
    console.log("POST /clockins", req.body);
    try {
        const clockin = req.body;
        if (!clockin.ClockinTime) {
            clockin.ClockinTime = new Date();
        }
        const result = await collections?.clockins?.insertOne(clockin);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new clockin: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new clockin.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

clockinRouter.put("/:id", async (req, res) => {
    console.log(`PUT /clockins/${req.params.id}`, req.body); 
    try {
        const id = req?.params?.id;
        const clockin = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.clockins?.updateOne(query, { $set: clockin });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a clockin: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a clockin: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a clockin: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

clockinRouter.delete("/:id", async (req, res) => {
    console.log(`DELETE /clockins/${req.params.id}`); // Add logging
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.clockins?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a clockin: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a clockin: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a clockin: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
