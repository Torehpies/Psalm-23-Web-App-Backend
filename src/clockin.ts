import * as mongodb from "mongodb";

export interface Clockin {
    name: string;
    position: string;
    _id?: mongodb.ObjectId;
    ClockinTime?: Date;
}
