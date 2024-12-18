import mongoose, { Schema } from "mongoose";

const UsedSuppliesSchema = new mongoose.Schema(
    {
        supply: {
            type: Schema.Types.ObjectId,
            ref: "Supplies",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [0, 'Quantity used cannot be negative']
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },
        usedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("UsedSupplies", UsedSuppliesSchema);