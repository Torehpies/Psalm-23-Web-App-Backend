import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

const OrdersSchema = new mongoose.Schema(
    {   
        Date: {
            type: Date,
            default: Date.now
        },
        TotalAmount: {
            type: Number,
            required: true
        },
        PaymentMethod:{
            type: String,
            required: true
        },
        EmployeeId: {
            type: Types.ObjectId,
            ref: "Employees",
            required: false
        },
        products: [{
            _id: {
                type: Types.ObjectId,
                required: true,
                ref: "Products"
            },
            Quantity: {
                type: Number,
                required: true
            },
            size: {
                type: String,
                required: false
            }
        }],
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Orders", OrdersSchema);