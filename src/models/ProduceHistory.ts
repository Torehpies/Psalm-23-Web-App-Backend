
import * as mongodb from "mongodb";

export interface ProduceHistory {
    _id?: mongodb.ObjectId;
    product: {
        _id: mongodb.ObjectId;
        details?: any;
    };
    Quantity: number;
    Date?: Date;
    EmployeeId?: mongodb.ObjectId;
}