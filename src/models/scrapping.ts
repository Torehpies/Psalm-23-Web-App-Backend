import mongoose, { Schema } from "mongoose";

const scrappingSchema = new mongoose.Schema(
    {
        item: {
            type: Schema.Types.ObjectId,
            refPath: 'itemType',
            required: true
        },
        itemType: {
            type: String,
            required: true,
            enum: ['Products', 'Supplies']
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

export default mongoose.model("scrapping", scrappingSchema);