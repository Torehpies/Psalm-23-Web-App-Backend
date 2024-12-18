import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        Date: {
            type: Date,
            default: Date.now
        },
        TimeIn: {
            type: Date,
            required: true
        },
        TimeOut: {
            type: Date
        },
        workHours: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Attendance", AttendanceSchema);