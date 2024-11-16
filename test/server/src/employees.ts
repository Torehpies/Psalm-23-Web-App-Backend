import * as mongodb from "mongodb";

export interface Employees {
    name: string;
    _id?: mongodb.ObjectId;
    TotalWorkHours?: number;
    Attendance: [
        {
            Date?: Date; 
            TimeIn?: string; 
            Timeout?: string; 
        }
    ],
}

export function getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
