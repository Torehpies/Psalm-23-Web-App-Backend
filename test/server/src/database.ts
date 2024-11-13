import * as mongodb from "mongodb";
import { Employee } from "./employee";
import { Ingredient } from "./ingredients";
import { Product } from "./product";
import { Clockin } from "./clockin";
import { Clockout } from "./clockout";
import { ProductDescription } from "./productdescript";

export const collections: {
    employees?: mongodb.Collection<Employee>;
    ingredients?: mongodb.Collection<Ingredient>;
    products?: mongodb.Collection<Product>;
    clockins?: mongodb.Collection<Clockin>;
    clockouts?: mongodb.Collection<Clockout>;
    productDescriptions?: mongodb.Collection<ProductDescription>;
    users?: mongodb.Collection<mongodb.Document>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    console.log("Connected to database");

    const db = client.db("sample_mflix");  // Change the database to sample_mflix
    await applySchemaValidation(db);

    // Initialize collections
    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;

    const ingredientsCollection = db.collection<Ingredient>("ingredients");
    collections.ingredients = ingredientsCollection;

    const productsCollection = db.collection<Product>("products");
    collections.products = productsCollection;

    const clockinsCollection = db.collection<Clockin>("clockins");
    collections.clockins = clockinsCollection;

    const clockoutsCollection = db.collection<Clockout>("clockouts");
    collections.clockouts = clockoutsCollection;

    const productDescriptionsCollection = db.collection<ProductDescription>("productdescriptions");
    collections.productDescriptions = productDescriptionsCollection;

    // Initialize users collection
    const usersCollection = db.collection("test");
    collections.users = usersCollection;

    console.log("Initialized collections");
}

async function applySchemaValidation(db: mongodb.Db) {
    // Employee Schema
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
                    description: "'level' is required and is one of 'junior', 'mid', 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
            },
        },
    };

    // Ingredient Schema
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
                date: {
                    bsonType: "date",
                    description: "'date' is optional and is a date",
                },
            },
        },
    };

    // Product Schema
    const productSchema = {
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
                date: {
                    bsonType: "date",
                    description: "'date' is optional and is a date",
                },
                expirationDate: {
                    bsonType: "string",
                    description: "'expirationDate' is optional and is a string",
                },
            },
        },
    };

    // Clockin Schema
    const clockinSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position"],
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
                },
                ClockinTime: {
                    bsonType: "date",
                    description: "'ClockinTime' is optional and is a date",
                },
            },
        },
    };

    // Clockout Schema
    const clockoutSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position"],
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
                },
                ClockoutTime: {
                    bsonType: "date",
                    description: "'ClockoutTime' is optional and is a date",
                },
            },
        },
    };

    // ProductDescription Schema
    const productDescriptionSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "Description"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                Description: {
                    bsonType: "object",
                    required: ["stock", "unit"],
                    properties: {
                        stock: {
                            bsonType: "number",
                            description: "'stock' is required and is a number",
                        },
                        unit: {
                            bsonType: "string",
                            description: "'unit' is required and is a string",
                        },
                        date: {
                            bsonType: "date",
                            description: "'date' is optional and is a date",
                        },
                        expirationDate: {
                            bsonType: "string",
                            description: "'expirationDate' is optional and is a string",
                        },
                    },
                },
            },
        },
    };

    // User Schema
    const userSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "password", "email"],
            additionalProperties: false,
            properties: {
                _id: {},
                username: {
                    bsonType: "string",
                    description: "'username' is required and is a string",
                },
                password: {
                    bsonType: "string",
                    description: "'password' is required and is a string",
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string",
                },
            },
        },
    };

    // Apply schema validation for each collection
    const collectionsWithSchemas = [
        { name: "employees", schema: employeeSchema },
        { name: "ingredients", schema: ingredientSchema },
        { name: "products", schema: productSchema },
        { name: "clockins", schema: clockinSchema },
        { name: "clockouts", schema: clockoutSchema },
        { name: "productdescriptions", schema: productDescriptionSchema },
        { name: "users", schema: userSchema }
    ];

    for (const { name, schema } of collectionsWithSchemas) {
        try {
            await db.command({
                collMod: name,
                validator: schema,
            });
        } catch (error: any) {
            if (error.codeName === "NamespaceNotFound") {
                await db.createCollection(name, { validator: schema });
            }
        }
    }

    console.log("Applied schema validation");
}
