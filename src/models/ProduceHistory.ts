import { Schema, model, Types } from "mongoose";

const produceHistorySchema = new Schema(
    {
        product: {
            type: Types.ObjectId,
            ref: "Products",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [0, 'Quantity produced cannot be negative']
        },
        employee: {
            type: Types.ObjectId,
            ref: "Employees",
            required: false
        },
        producedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const ProduceHistory = model("ProduceHistory", produceHistorySchema);

export default ProduceHistory;