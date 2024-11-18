import { Schema, model } from "mongoose";

const attendanceSchema = new Schema({
    Date: { type: Date, default: Date.now },
    TimeIn: { type: String, required: true },
    Timeout: { type: String, required: true }
});

const employeeSchema = new Schema({
    name: { type: String, required: true },
    TotalWorkHours: { type: Number, default: 0 },
    Attendance: { type: [attendanceSchema], default: [] }
});

const Employee = model("Employee", employeeSchema);

export default Employee;

export function getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
