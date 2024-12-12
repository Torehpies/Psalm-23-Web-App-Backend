import { Request, Response } from "express";
import Sales from "../models/sales"; // Ensure this import is correct

export const getSales = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { date, hour } = req.query;
        if (!date || !hour) {
            return res.status(400).send("Date and hour are required");
        }

        const queryDate = new Date(date as string);
        queryDate.setMinutes(0, 0, 0); // Set the date to the start of the hour
        const queryHour = parseInt(hour as string, 10);

        console.log(`Querying sales for date: ${queryDate.toISOString()} and hour: ${queryHour}`);

        const sales = await Sales.findOne({ date: queryDate, hour: queryHour }).select('totalAmount date hour orderCount');
        if (sales) {
            return res.status(200).json(sales);
        } else {
            console.log("No sales data found for the given date and hour");
            return res.status(404).send("No sales data found for the given date and hour");
        }
    } catch (error) {
        return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};

export const getAllSales = async (_req: Request, res: Response): Promise<Response | void> => {
    try {
        const sales = await Sales.find().select('totalAmount date hour orderCount');
        return res.status(200).json(sales);
    } catch (error) {
        return res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
};
