import * as mongodb from "mongodb";

export interface Products {
    _id?: mongodb.ObjectId;
    name: string;
    Unit: "Mililiters" | "Liters" | "Grams" | "Kilograms" | string;
    Price: number;
    Status: "Active" | "Inactive";
    CurrentStock: number;
    PAR: number;
}