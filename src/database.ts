import * as mongodb from "mongodb";
import { IngredientDetails } from "./models/ingredientDetails"; 
import { Employees } from "./models/employees"; 
import { StockHistory } from "./models/StockHistory"; 
import { Users } from "./models/user"; // Add this line

export const collections: {
    db?: mongodb.Db;
    ingredientDetails?: mongodb.Collection<IngredientDetails>; 
    employees?: mongodb.Collection<Employees>; 
    stockHistory?: mongodb.Collection<StockHistory>; 
    users?: mongodb.Collection<Users>; // Add this line
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    console.log("Connected to database"); 

    const db = client.db("meanStackExample");
    collections.db = db; 
    await applySchemaValidation(db);

    const ingredientDetailsCollection = db.collection<IngredientDetails>("ingredientDetails");
    collections.ingredientDetails = ingredientDetailsCollection; 

    const employeesCollection = db.collection<Employees>("employees");
    collections.employees = employeesCollection;

    const stockHistoryCollection = db.collection<StockHistory>("stockHistory");
    collections.stockHistory = stockHistoryCollection;

    const usersCollection = db.collection<Users>("users"); // Add this line
    collections.users = usersCollection; // Add this line

    console.log("Initialized collections"); 
}

async function applySchemaValidation(db: mongodb.Db) {
    const employeesSchema = {
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
            required: ["name", "CurrentStock", "Unit", "PAR"],
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
            },
        },
    };

    const stockHistorySchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["ingredient", "Price", "Quantity"],
            additionalProperties: false,
            properties: {
                _id: {},
                ingredient: {
                    bsonType: "object",
                    required: ["_id"],
                    properties: {
                        _id: {
                            bsonType: "objectId",
                            description: "'_id' is required and is an ObjectId",
                        },
                    },
                },
                Price: {
                    bsonType: "number",
                    description: "'Price' is required and is a number",
                },
                Quantity: {
                    bsonType: "number",
                    description: "'Quantity' is required and is a number",
                },
                Date: {
                    bsonType: "date",
                    description: "'Date' is optional and is a date",
                },
                EmployeeId: {
                    bsonType: "objectId",
                    description: "'EmployeeId' is optional and is an ObjectId",
                },
            },
        },
    };

    const usersSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["EmployeeId", "Name", "Email", "Password", "Role", "JoinDate", "Status"],
            additionalProperties: false,
            properties: {
                _id: {},
                EmployeeId: {
                    bsonType: "objectId",
                    description: "'EmployeeId' is required and is an ObjectId",
                },
                Name: {
                    bsonType: "string",
                    description: "'Name' is required and is a string",
                },
                Email: {
                    bsonType: "string",
                    description: "'Email' is required and is a string",
                },
                Password: {
                    bsonType: "string",
                    description: "'Password' is required and is a string",
                },
                Role: {
                    bsonType: "string",
                    enum: ["Admin", "User"],
                    description: "'Role' is required and is either 'Admin' or 'User'",
                },
                JoinDate: {
                    bsonType: "date",
                    description: "'JoinDate' is required and is a date",
                },
                Status: {
                    bsonType: "string",
                    enum: ["Active", "Inactive"],
                    description: "'Status' is required and is either 'Active' or 'Inactive'",
                },
            },
        },
    };

    // Apply schema validation for employees
    await db.command({
        collMod: "employees",
        validator: employeesSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", {validator: employeesSchema});
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

    // Apply schema validation for stockHistory
    await db.command({
        collMod: "stockHistory",
        validator: stockHistorySchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("stockHistory", {validator: stockHistorySchema});
        }
    });

    // Apply schema validation for users
    await db.command({
        collMod: "users",
        validator: usersSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("users", {validator: usersSchema});
        }
    });

    console.log("Applied schema validation"); 
}