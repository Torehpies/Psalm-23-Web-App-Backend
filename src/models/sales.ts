import mongoose, { Schema, Document } from "mongoose";

interface ISales extends Document {
    date: Date;
    hour: number;
    totalAmount: number;
    orderCount: number; // Add orderCount field
}

const SalesSchema: Schema = new Schema({
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderCount: { // Add orderCount field
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Sales = mongoose.model<ISales>('Sales', SalesSchema);

export default Sales;