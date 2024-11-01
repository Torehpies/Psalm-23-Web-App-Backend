import * as mongodb from "mongodb";

export interface Product {
    name: string;
    stock: number;
    unit: string;
    date: Date;
    _id?: mongodb.ObjectId;
}
