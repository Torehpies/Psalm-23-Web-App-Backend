import { Request, Response, NextFunction } from 'express';
import ProductPerformance, { IProduct, ICategory } from '../models/productPerformance';
import { CreateSuccess } from '../utils/success';
import { CreateError } from '../utils/error';
import { ProductOrders } from '../models/Orders';

export const updateProductPerformance = async (date: Date, products: ProductOrders[]): Promise<void> => {
    try {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        console.log('Updating product performance:', date, products);

        const productPerformance = await ProductPerformance.findOne({ date: startOfDay });

        if (productPerformance) {
            // Update existing product performance
            let total = 0;
            products.forEach(product => {
                const category = productPerformance.categories.find(c => c.category === product.category);
                if (category) {
                    const existingProduct = category.products.find(p => p.productId.toString() === product.productId.toString() &&
                        p.size === product.size);
                    if (existingProduct) {
                        existingProduct.quantity += product.quantity;
                        existingProduct.price = product.price; // Update price if needed
                    } else {
                        category.products.push({
                            productId: product.productId,
                            name: product.name,
                            size: product.size,
                            quantity: product.quantity,
                            price: product.price
                        } as IProduct);
                    }
                } else {
                    productPerformance.categories.push({
                        category: product.category,
                        products: [{
                            productId: product.productId,
                            name: product.name,
                            size: product.size,
                            quantity: product.quantity,
                            price: product.price
                        } as IProduct]
                    } as ICategory);
                }
                total += product.quantity * product.price;
            });
            productPerformance.total = total;
            await productPerformance.save();
        } else {
            const categories: ICategory[] = [];
            let total = 0;
            products.forEach(product => {
                const category = categories.find(c => c.category === product.category);
                if (category) {
                    category.products.push({
                        productId: product.productId,
                        name: product.name,
                        size: product.size,
                        quantity: product.quantity,
                        price: product.price
                    } as IProduct);
                } else {
                    categories.push({
                        category: product.category,
                        products: [{
                            productId: product.productId,
                            name: product.name,
                            size: product.size,
                            quantity: product.quantity,
                            price: product.price
                        } as IProduct]
                    } as ICategory);
                }
                total += product.quantity * product.price;
            });
            const newProductPerformance = new ProductPerformance({ date: startOfDay, categories, total });
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