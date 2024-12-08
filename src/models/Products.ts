import mongoose, { Schema } from 'mongoose';

const ProductsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        Unit: {
            type: String,
            required: true
        },
        Category:{
            type: String,
            required: true
        },
        Price: {
            type: Number,
            required: true
        },
        Status: {
            type: String,
            enum: ["Active", "Inactive"],
            required: true
        },
        CurrentStock: {
            type: Number,
            required: true
        },
        PAR: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Products", ProductsSchema);