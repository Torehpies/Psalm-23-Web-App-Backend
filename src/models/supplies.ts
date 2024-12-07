import mongoose, { Schema } from "mongoose";

const SuppliesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        category: {
            type: String,
            enum: {
                values: ["Supply", "Ingredient"],
                message: 'Category must be either "Supply" or "Ingredient"'
            },
            required: [true, 'Category is required']
        },
        currentStock: {
            type: Number,
            required: [true, 'Current stock is required'],
            min: [0, 'Current stock cannot be negative']
        },
        unit: {
            type: String,
            required: [true, 'Unit is required']
        },
        ExpiryDate: {

            type: Date,
            required: false
        },
        par: {
            type: Number,
            required: [true, 'Par is required'],
            min: [0, 'Par cannot be negative']
        }
    },
    {
        timestamps: true,
        strict: "throw" 
    }
);

export default mongoose.model("Supplies", SuppliesSchema);