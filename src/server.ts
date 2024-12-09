import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import employeesRouter from "./routes/employees.routes"; 
// import roleRoute from "./routes/role";
import authRoute from "./routes/auth";
import { productsRouter } from "./routes/Products.routes";
import { suppliesRouter } from "./routes/supplies.routes";
import { produceHistoryRouter } from "./routes/produceHistory.routes";
import attendanceRouter from "./routes/attendance.routes";
import { stockHistoryRouter } from "./routes/StockHistory.routes";
import userRoute from "./routes/user";
import { usedSuppliesRouter } from "./routes/usedSupplies.routes";
import cookieParser from "cookie-parser";
import scrappingRouter from "./routes/scrapping.routes";
import ordersRouter from "./routes/orders.routes";

const app = express();
dotenv.config();

app.use(cors()); 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:4200",
	credentials: true
}))
// app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productsRouter);
app.use("/api/supplies", suppliesRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/produceHistory", produceHistoryRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/stockHistory", stockHistoryRouter);
app.use("/api/user", userRoute);
app.use("/api/usedSupplies", usedSuppliesRouter);
app.use("/api/scrapping", scrappingRouter);
app.use("/api/orders", ordersRouter);

app.use((obj: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	const statusCode = obj.status || 500;
	const message = obj.message || "Something went wrong";
	res.status(statusCode).json({
		success: [200, 201,204].some( a => a === obj.status) ? true : false,
		status: statusCode,
		message: message,
		data: obj.data
	})
});

//DB Connection
const connectMongoDB = async () => {
	try {
		await mongoose.connect(process.env.ATLAS_URI as string);
		console.log("Connected to Database!");

	} catch (error) {
		throw error;
	}
}

app.listen(8800, () => {
	connectMongoDB();
	console.log("Connected to Backend!");
})
