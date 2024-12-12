
import { Request, Response } from "express";
import MonthlySales from "../models/monthlySales";

export const updateMonthlySales = async (req: Request, res: Response) => {
    try {
        const { date, totalAmount } = req.body;
        const formattedDate = new Date(date);
        formattedDate.setDate(1);
        formattedDate.setHours(0, 0, 0, 0);
        await updateMonthlySalesLogic(formattedDate, totalAmount);
        res.status(200).send("Monthly sales updated");
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const updateMonthlySalesLogic = async (date: Date, totalAmount: number) => {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);

    const monthlySales = await MonthlySales.findOne({ Date: date });
    if (monthlySales) {
        monthlySales.TotalAmount += totalAmount;
        await monthlySales.save();
    } else {
        await MonthlySales.create({ Date: date, TotalAmount: totalAmount });
    }
};

export const getMonthlySales = async (req: Request, res: Response) => {
    try {
        const { year, month } = req.params;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const monthlySales = await MonthlySales.findOne({
            Date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        if (monthlySales) {
            res.status(200).send(monthlySales);
        } else {
            res.status(404).send("No sales data found for the given month");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
};