
import mongoose, { Schema } from "mongoose";

const scrappingSchema = new mongoose.Schema(
    {
        supply: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        Quantity: {
            type: Number,
            required: true,
            min: [0, 'Quantity used cannot be negative']
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("scrapping", scrappingSchema);