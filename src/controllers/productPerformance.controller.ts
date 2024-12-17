import { Request, Response, NextFunction } from 'express';
import ProductPerformance, { IProduct } from '../models/productPerformance';
import { CreateSuccess } from '../utils/success';
import { CreateError } from '../utils/error';

export const updateProductPerformance = async (date: Date, products: IProduct[]): Promise<void> => {
    try {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        console.log('Updating product performance:', date, products);

        const productPerformance = await ProductPerformance.findOne({ date: startOfDay });

        if (productPerformance) {
            // Update existing product performance
            let total = 0;
            products.forEach(product => {
                const existingProduct = productPerformance.products.find(p => p.productId.toString() === product.productId.toString() &&
                    p.size === product.size);
                if (existingProduct) {
                    existingProduct.quantity += product.quantity;
                    existingProduct.price = product.price; // Update price if needed
                } else {
                    productPerformance.products.push(product);
                }
                total += product.quantity * product.price;
            });
            productPerformance.total = total;
            await productPerformance.save();
        } else {
            // Create new product performance
            const total = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
            const newProductPerformance = new ProductPerformance({ date: startOfDay, products, total });
            await newProductPerformance.save();
        }
    } catch (error) {
        console.error('Error updating product performance:', error);
    }
};

export const getAllProductPerformance = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const productPerformance = await ProductPerformance.find({});
        return next(CreateSuccess(200, "Product Performance", productPerformance));
    } catch (error: any) {
        return next(CreateError(500, error instanceof Error ? error.message : "Unknown error"));
    }
}