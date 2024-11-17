
import * as mongodb from "mongodb";

// Rename As Supplies
export interface Supplies {
    _id?: mongodb.ObjectId;
    name: string;
    Category: "Supply" | "Ingredient";
    CurrentStock: number;
    Unit: "Mililiters" | "Liters" | "Grams" | "Kilograms" | string;
    PAR: number;
}