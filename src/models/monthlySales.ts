
import mongoose from "mongoose";

const MonthlySalesSchema = new mongoose.Schema(
    {
        Date: {
            type: Date,
            required: true,
            unique: true
        },
        TotalAmount: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("MonthlySales", MonthlySalesSchema);