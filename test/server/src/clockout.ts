import * as mongodb from "mongodb";

export interface Clockout {
    name: string;
    position: string;
    _id?: mongodb.ObjectId;
    ClockoutTime?: Date;
}
