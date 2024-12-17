import mongoose, { Schema, Document } from 'mongoose';

interface IProductPerformance extends Document {
    date: Date;
    total: number;
    categories: ICategory[];
}

export interface ICategory extends Document {
    category: string;
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
}, { _id: false }); // Disable automatic _id field

const CategorySchema: Schema = new Schema({
    category: { type: String, required: true },
    products: { type: [ProductSchema], _id: false }
});

const ProductPerformanceSchema: Schema = new Schema({
    date: { type: Date, required: true },
    total: { type: Number, required: true },
    categories: { type: [CategorySchema], _id: false }
}, { timestamps: true });

export default mongoose.model<IProductPerformance>('ProductPerformance', ProductPerformanceSchema);
