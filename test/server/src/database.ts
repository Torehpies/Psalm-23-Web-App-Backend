import * as mongodb from "mongodb";
import { Employee } from "./employee";
import { IngredientDetails } from "./ingredientDetails"; // Import IngredientDetails
import { Product } from "./product";
import { ProductDescription } from "./productdescript";
import { AttendanceMonitoring } from "./attendance"; 

export const collections: {
    db?: mongodb.Db;
    employees?: mongodb.Collection<Employee>;
    ingredientDetails?: mongodb.Collection<IngredientDetails>; // Add ingredientDetails collection
    products?: mongodb.Collection<Product>;
    productDescriptions?: mongodb.Collection<ProductDescription>;
    attendanceMonitoring?: mongodb.Collection<AttendanceMonitoring>; 
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    console.log("Connected to database"); 

    const db = client.db("meanStackExample");
    collections.db = db; // Set the db property in collections
    await applySchemaValidation(db);

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;

    const ingredientDetailsCollection = db.collection<IngredientDetails>("ingredientDetails");
    collections.ingredientDetails = ingredientDetailsCollection; 

    const productsCollection = db.collection<Product>("products");
    collections.products = productsCollection;

    const productDescriptionsCollection = db.collection<ProductDescription>("productdescriptions");
    collections.productDescriptions = productDescriptionsCollection;

    const attendanceMonitoringCollection = db.collection<AttendanceMonitoring>("attendanceMonitoring");
    collections.attendanceMonitoring = attendanceMonitoringCollection;

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

    const attendanceMonitoringSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "Attendance"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                TotalWorkHours: {
                    bsonType: "number",
                    description: "'TotalWorkHours' is optional and is a number",
                },
                Attendance: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            Date: {
                                bsonType: "date",
                                description: "'Date' is optional and is a date",
                            },
                            TimeIn: {
                                bsonType: "string",
                                description: "'TimeIn' is required and is a string",
                            },
                            Timeout: {
                                bsonType: "string",
                                description: "'Timeout' is required and is a string",
                            },
                        },
                    },
                },
            },
        },
    };

    const ingredientDetailsSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "CurrentStock", "Unit", "PAR", "StockHistory"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                CurrentStock: {
                    bsonType: "number",
                    description: "'CurrentStock' is required and is a number",
                },
                Unit: {
                    bsonType: "string",
                    description: "'Unit' is required and is a string",
                },
                PAR: {
                    bsonType: "number",
                    description: "'PAR' is required and is a number",
                },
                StockHistory: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["Date", "Price", "Quantity", "EmployeeId"],
                        properties: {
                            Date: {
                                bsonType: "date",
                                description: "'Date' is required and is a date",
                            },
                            Price: {
                                bsonType: "number",
                                description: "'Price' is required and is a number",
                            },
                            Quantity: {
                                bsonType: "number",
                                description: "'Quantity' is required and is a number",
                            },
                            EmployeeId: {
                                bsonType: "string",
                                description: "'EmployeeId' is required and is a string",
                            },
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

    // Apply schema validation for products
    await db.command({
        collMod: "products",
        validator: productSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("products", {validator: productSchema});
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

    // Apply schema validation for attendanceMonitoring
    await db.command({
        collMod: "attendanceMonitoring",
        validator: attendanceMonitoringSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("attendanceMonitoring", {validator: attendanceMonitoringSchema});
        }
    });

    // Apply schema validation for ingredientDetails
    await db.command({
        collMod: "ingredientDetails",
        validator: ingredientDetailsSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("ingredientDetails", {validator: ingredientDetailsSchema});
        }
    });

    console.log("Applied schema validation"); // Add logging
}