import mongoose, { Schema, Document } from 'mongoose';

interface IProductPerformance extends Document {
    date: Date;
    products: IProduct[];
}

interface IProduct extends Document {
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    size: string;
    quantity: number;
    price: number;
}

const ProductSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    size: { type: String, required: false },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const ProductPerformanceSchema: Schema = new Schema({
    date: { type: Date, required: true },
    products: [ProductSchema]
}, { timestamps: true });

export default mongoose.model<IProductPerformance>('ProductPerformance', ProductPerformanceSchema);
