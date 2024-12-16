import { NextFunction, Request, Response } from "express";
import Orders from "../models/Orders";
import Products from "../models/Product";
import { updateOrderPerformanceLogic } from "./OrderPerformance.controller";
import { updateProductPerformance } from './productPerformance.controller';
import { CreateSuccess } from "../utils/success";
import { CreateError } from "../utils/error";

export const getOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await Orders.find({});
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

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.body)
        const {  date, total, paymentMethod, employeeId, products} = req.body;
        // const products = req.body.products;
        // let totalAmount = 0;

        // for (const product of products) {
        //     const productDetails = await Products.findById(product._id, 'Price');
        //     if (productDetails) {
        //         totalAmount += (productDetails.price ?? 0) * (product.Quantity || 1);
        //     }
        // }

        const newOrder = new Orders({ ...req.body});
        
        // console.log(newOrder)
        const today = new Date();
        const productData = products.map((product: any) => ({
            productId: product._id,
            name: product.name,
            quantity: product.Quantity,
            price: product.price,
            size: product.size
        }));
        await updateProductPerformance(today, productData);
        
        // console.log(productData)
        await newOrder.save();
        return next(CreateSuccess(200, "New Order Created", newOrder));
    } catch (error) {
        return next(CreateError(400, "Order not Created"));
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const products = req.body.products;
        let totalAmount = 0;

        for (const product of products) {
            const productDetails = await Products.findById(product._id, 'Price');
            if (productDetails) {
                totalAmount += (productDetails.price ?? 0) * (product.Quantity || 1);
            }
        }

        const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, { ...req.body, TotalAmount: totalAmount }, { new: true });
        if (updatedOrder) {
            const today = new Date();
            const productData = products.map((product: any) => ({
                productId: product._id,
                name: product.name,
                quantity: product.Quantity,
                price: product.Price,
                size: product.size
            }));
            await updateOrderPerformanceLogic(today, productData);
            await updateProductPerformance(today, productData);
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