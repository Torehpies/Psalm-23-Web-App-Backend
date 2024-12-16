import mongoose, { Schema, Document, Types } from 'mongoose';

interface IProductPerformance {
    productId: Types.ObjectId;
    quantity: number;
}

interface IOrderPerformance extends Document {
    date: Date;
    totalProductsBought: number;
    products: IProductPerformance[];
}

const ProductPerformanceSchema: Schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const OrderPerformanceSchema: Schema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
        set: (date: Date) => {
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    totalProductsBought: {
        type: Number,
        required: true
    },
    products: [ProductPerformanceSchema]
}, {
    timestamps: true
});

const OrderPerformance = mongoose.model<IOrderPerformance>('OrderPerformance', OrderPerformanceSchema);

export default OrderPerformance;