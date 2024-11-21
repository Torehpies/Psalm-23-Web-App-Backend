import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import { connectToDatabase } from "./database";
// import { employeesRouter } from "./routes/employees.routes"; 
// import { ingredientDetailsRouter } from "./routes/ingredientDetails.routes"; 
// import { stockHistoryRouter } from "./routes/StockHistory.routes"; 
// import { usersRouter } from "./routes/Users.routes"; 
import roleRoute from "./routes/role";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:4200",
	credentials: true
}))
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

//Error Handling

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
// connectToDatabase(ATLAS_URI)
//   .then(() => {

//     app.use(cors());



//     app.use("/employees", employeesRouter); 
//     app.use("/ingredientDetails", ingredientDetailsRouter); 
//     app.use("/stockHistory", stockHistoryRouter); 
//     //app.use("/users", usersRouter); // Add this line
//     app.listen(7000, () => {
//       console.log(`Server running at http://localhost:7000...`);
//     });
//   })
//   .catch((error) => console.error("Database connection failed:", error));
