import ProductPerformance from '../models/productPerformance';

export const updateProductPerformance = async (date: Date, products: any[]): Promise<void> => {
    try {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        console.log('Updating product performance:', date, products);

        const productPerformance = await ProductPerformance.findOne({ date: startOfDay });

        if (productPerformance) {
            // Update existing product performance
            products.forEach(product => {
                const existingProduct = productPerformance.products.find(p => p.productId.toString() === product.productId.toString() &&
                    p.size === product.size);
                if (existingProduct) {

                    existingProduct.quantity += product.quantity;
                    existingProduct.price = product.price; // Update price if needed
                } else {
                    productPerformance.products.push(product);
                }
            });
            await productPerformance.save();
        } else {
            // Create new product performance
            const newProductPerformance = new ProductPerformance({ date: startOfDay, products });
            await newProductPerformance.save();
        }
    } catch (error) {
        console.error('Error updating product performance:', error);
    }
};
