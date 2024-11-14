import * as mongodb from "mongodb";

export interface IngredientDetails {
    _id?: mongodb.ObjectId;
    name: string;
    CurrentStock: number;
    Unit: "Mililiters" | "Liters" | "Grams" | "Kilograms" | string;
    PAR: number;
}
