import * as mongodb from "mongodb";

export interface Ingredient {
    name: string;
    stock: number;
    unit: string;
    _id?: mongodb.ObjectId;
    date?: Date;
}
