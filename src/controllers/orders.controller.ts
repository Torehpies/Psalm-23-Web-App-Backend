import { Request, Response } from "express";
import Orders from "../models/Orders";
import Products from "../models/Products";
import { updateOrderPerformanceLogic } from "./OrderPerformance.controller";

export const getOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await Orders.find({}).populate('products._id', 'name Quantity Price');
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Orders.findById(req.params.id).populate('products._id', 'name Quantity Price');
        if (!order) {
            res.status(404).send("Order not found");
        } else {
            res.status(200).send(order);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const products = req.body.products;
        let totalAmount = 0;

        for (const product of products) {
            const productDetails = await Products.findById(product._id, 'Price');
            if (productDetails) {
                totalAmount += productDetails.Price * (product.Quantity || 1);
            }
        }

        const newOrder = new Orders({ ...req.body, TotalAmount: totalAmount });
        await newOrder.save();
        
        const today = new Date();
        const productData = products.map((product: any) => ({
            productId: product._id,
            quantity: product.Quantity
        }));
        await updateOrderPerformanceLogic(today, productData);

        res.status(201).send(`Created a new order: ID ${newOrder._id}`);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const products = req.body.products;
        let totalAmount = 0;

        for (const product of products) {
            const productDetails = await Products.findById(product._id, 'Price');
            if (productDetails) {
                totalAmount += productDetails.Price * (product.Quantity || 1);
            }
        }

        const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, { ...req.body, TotalAmount: totalAmount }, { new: true });
        if (updatedOrder) {
            const today = new Date();
            const productData = products.map((product: any) => ({
                productId: product._id,
                quantity: product.Quantity
            }));
            await updateOrderPerformanceLogic(today, productData);
        }

        if (!updatedOrder) {
            res.status(404).send("Order not found");
        } else {
            res.status(200).send(`Updated order: ID ${updatedOrder._id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const result = await Orders.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send("Order not found");
        } else {
            res.status(202).send(`Removed an order: ID ${req.params.id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};