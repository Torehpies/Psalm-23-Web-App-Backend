import * as mongodb from "mongodb";

export interface Users {
    _id?: mongodb.ObjectId;
    EmployeeId: mongodb.ObjectId;
    Name: string;
    Email: string;
    Password: string;
    Role: "Admin" | "User";
    JoinDate: Date;
    Status: "Active" | "Inactive";
}
