import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const usersRouter = express.Router();
usersRouter.use(express.json());

function convertToObjectId(id: string): ObjectId {
    return new ObjectId(id);
}

function convertToDate(dateString: string): Date {
    return new Date(dateString);
}

usersRouter.get("/", async (_req, res) => {
    try {
        const users = await collections.users?.find({}).toArray();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

usersRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const user = await collections.users?.findOne(query);

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a user: ID ${req.params.id}`);
    }
});

usersRouter.post("/", async (req, res) => {
    try {
        const user = req.body;
        if (user.EmployeeId) {
            user.EmployeeId = convertToObjectId(user.EmployeeId);
        }
        if (user.JoinDate) {
            user.JoinDate = convertToDate(user.JoinDate);
        }

        const result = await collections.users?.insertOne(user);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

usersRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.body;
        if (user.EmployeeId) {
            user.EmployeeId = convertToObjectId(user.EmployeeId);
        }
        if (user.JoinDate) {
            user.JoinDate = convertToDate(user.JoinDate);
        }
        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.updateOne(query, { $set: user });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated user ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update user ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

usersRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a user: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a user: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a user: ID ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});
