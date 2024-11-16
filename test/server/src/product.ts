import * as mongodb from "mongodb";

export interface Products {
    _id?: mongodb.ObjectId;
    Name: string;
    Unit: string;
    Category: string

}
