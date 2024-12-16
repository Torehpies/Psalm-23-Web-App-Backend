import OrderPerformance from '../models/OrderPerformance';
import Orders from '../models/Orders';
import { Request, Response } from "express";
import { Types } from "mongoose";

export const updateOrderPerformance = async (req: Request, res: Response) => {
    try {
        const { date, products } = req.body;
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);
        await updateOrderPerformanceLogic(formattedDate, products);
        res.status(200).send("Order performance updated");
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateOrderPerformanceLogic = async (date: Date, products: { productId: Types.ObjectId, quantity: number }[]) => {
    date.setHours(0, 0, 0, 0);

    const performance = await OrderPerformance.findOne({ date });
    if (performance) {
        performance.totalProductsBought += products.reduce((sum, product) => sum + product.quantity, 0);
        products.forEach(product => {
            const existingProduct = performance.products.find(p => p.productId.equals(product.productId));
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                performance.products.push(product);
            }
        });
        await performance.save();
    } else {
        const totalProductsBought = products.reduce((sum, product) => sum + product.quantity, 0);
        await OrderPerformance.create({ date, totalProductsBought, products });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { products } = req.body;

        const newOrder = new Orders(req.body);
        await newOrder.save();

        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const productData = products.map((product: any) => ({
            productId: product._id,
            quantity: product.Quantity
        }));
        await updateOrderPerformanceLogic(today, productData);

        res.status(201).send(`Created order: ID ${newOrder._id}`);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getAllOrderPerformance = async (req: Request, res: Response) => {
    try {
        const performance = await OrderPerformance.find();
        res.status(200).send(performance);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
}


export const getOrderPerformance = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const performance = await OrderPerformance.findOne({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('products.productId', 'name');

        if (performance) {
            res.status(200).send(performance);
        } else {
            res.status(404).send("No performance data found for the given date");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};