import mongoose, { Schema } from "mongoose";

const StockHistorySchema = new mongoose.Schema(
    {
        ingredient: {
            _id: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Supplies"
            },
            details: {
                type: Schema.Types.Mixed,
                required: false
            }
        },
        Price: {
            type: Number,
            required: true
        },
        Quantity: {
            type: Number,
            required: true
        },
        Date: {
            type: Date,
            default: Date.now
        },
        EmployeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employees",
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("StockHistory", StockHistorySchema);
