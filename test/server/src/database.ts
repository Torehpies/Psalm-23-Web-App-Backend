import * as mongodb from "mongodb";
import { Employee } from "./employee";
import { Ingredient } from "./ingredients";

export const collections: {
    employees?: mongodb.Collection<Employee>;
    ingredients?: mongodb.Collection<Ingredient>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExample");
    await applySchemaValidation(db);

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;

    const ingredientsCollection = db.collection<Ingredient>("ingredients");
    collections.ingredients = ingredientsCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const employeeSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
            },
        },
    };

    const ingredientSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "stock", "unit"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                stock: {
                    bsonType: "number",
                    description: "'stock' is required and is a number",
                },
                unit: {
                    bsonType: "string",
                    description: "'unit' is required and is a string",
                },
            },
        },
    };

    // Apply schema validation for employees
    await db.command({
        collMod: "employees",
        validator: employeeSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", {validator: employeeSchema});
        }
    });

    // Apply schema validation for ingredients
    await db.command({
        collMod: "ingredients",
        validator: ingredientSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("ingredients", {validator: ingredientSchema});
        }
    });
}