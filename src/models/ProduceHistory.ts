import { Schema, model, Types } from "mongoose";

const produceHistorySchema = new Schema({
    product: {
        _id: { type: Types.ObjectId, ref: 'Products', required: true },
        details: { type: Schema.Types.Mixed }
    },
    Quantity: { type: Number, required: true },
    Date: { type: Date, default: Date.now },
    EmployeeId: { type: Types.ObjectId, ref: 'Employees' }
});

const ProduceHistory = model("ProduceHistory", produceHistorySchema);

export default ProduceHistory;