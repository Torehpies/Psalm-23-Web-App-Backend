import * as mongodb from "mongodb";

export interface StockHistory {
    _id?: mongodb.ObjectId;
    ingredient: {
        _id: mongodb.ObjectId;
        details?: any; 
    };
    Price: number;
    Quantity: number;
    Date?: Date;
    EmployeeId?: mongodb.ObjectId;
}
