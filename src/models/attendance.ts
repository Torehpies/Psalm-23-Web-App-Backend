
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },
        Date: {
            type: Date,
            default: Date.now
        },
        TimeIn: {
            type: String,
            required: true
        },
        Timeout: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Attendance", AttendanceSchema);