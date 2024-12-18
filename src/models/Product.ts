import mongoose, { Schema } from 'mongoose';

const SizeSchema = new mongoose.Schema(
    {
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    { _id: false }
);

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number
        },
        sizes: [SizeSchema],
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

export default mongoose.model("Product", ProductSchema);