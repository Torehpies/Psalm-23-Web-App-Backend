import mongoose, { Schema } from 'mongoose';

const ProductsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        Category:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            required: true
        },
        currentStock: {
            type: Number,
            required: true
        },
        par: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Products", ProductsSchema);