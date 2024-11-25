import { Schema, model, Types } from "mongoose";

const produceHistorySchema = new Schema(
    {
        product: {
            _id: {
                type: Types.ObjectId,
                required: true,
                ref: "Products"
            },
            details: {
                type: Schema.Types.Mixed,
                required: false
            }
        },
        Quantity: {
            type: Number,
            required: true
        },
        Date: {
            type: Date,
            default: Date.now
        },
        EmployeeId: {
            type: Types.ObjectId,
            ref: "Employees",
            required: false
        }
    },
    {
        timestamps: true
    }
);

const ProduceHistory = model("ProduceHistory", produceHistorySchema);

export default ProduceHistory;