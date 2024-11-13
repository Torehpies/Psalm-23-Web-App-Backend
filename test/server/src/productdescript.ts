import * as mongodb from "mongodb";

export interface ProductDescription {
    name: string;
    Descriptions: {
        stock: number;
        unit: string;
        DateStocked?: Date;
        ExpirationDate?: string;
        _id?: mongodb.ObjectId;
    }
}
