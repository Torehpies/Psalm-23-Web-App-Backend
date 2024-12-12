import { Request, Response } from "express";
import DailySales from "../models/dailySales";
import Orders from "../models/Orders";

export const updateDailySales = async (req: Request, res: Response) => {
    try {
        const { date, totalAmount } = req.body;
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);
        await updateDailySalesLogic(formattedDate, totalAmount);
        res.status(200).send("Daily sales updated");
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateDailySalesLogic = async (date: Date, totalAmount: number) => {
    date.setHours(0, 0, 0, 0);

    const dailySales = await DailySales.findOne({ Date: date });
    if (dailySales) {
        dailySales.TotalAmount += totalAmount;
        await dailySales.save();
    } else {
        await DailySales.create({ Date: date, TotalAmount: totalAmount });
    }
};

export const getDailySales = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const dailySales = await DailySales.findOne({
            Date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        if (dailySales) {
            res.status(200).send(dailySales);
        } else {
            res.status(404).send("No sales data found for the given date");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};
