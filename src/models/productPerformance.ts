import mongoose, { Schema, Document } from 'mongoose';

interface IProductPerformance extends Document {
    date: Date;
    total: number;
    products: IProduct[];
}

export interface IProduct extends Document {
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    size: string;
    quantity: number;
    price: number;
}

const ProductSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    size: { type: String, required: false },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const ProductPerformanceSchema: Schema = new Schema({
    date: { type: Date, required: true },
    total: { type: Number, required: true },
    products: { type: [ProductSchema], _id: false } // Prevent _id generation for products
}, { timestamps: true });

export default mongoose.model<IProductPerformance>('ProductPerformance', ProductPerformanceSchema);
