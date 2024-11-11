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
    clockouts?: mongodb.Collection<Clockout>; // Add clockouts collection
    productDescriptions?: mongodb.Collection<ProductDescription>; // Add productDescriptions collection
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    console.log("Connected to database"); // Add logging

    const db = client.db("meanStackExample");
    await applySchemaValidation(db);

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
    console.log("Initialized collections"); // Add logging
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
                    description: "'level' is required and is one of 'junior', 'mid', 'senior'",
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
                date: {
                    bsonType: "date",
                    description: "'date' is optional and is a date",
                },
            },
        },
    };

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

    // Apply schema validation for products
    await db.command({
        collMod: "products",
        validator: productSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("products", {validator: productSchema});
        }
    });

    // Apply schema validation for clockins
    await db.command({
        collMod: "clockins",
        validator: clockinSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("clockins", {validator: clockinSchema});
        }
    });

    // Apply schema validation for clockouts
    await db.command({
        collMod: "clockouts",
        validator: clockoutSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("clockouts", {validator: clockoutSchema});
        }
    });

    // Apply schema validation for productDescriptions
    await db.command({
        collMod: "productdescriptions",
        validator: productDescriptionSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("productdescriptions", {validator: productDescriptionSchema});
        }
    });
    console.log("Applied schema validation"); // Add logging
}