import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { employeesRouter } from "./routes/employees.routes"; 
import roleRoute from "./routes/role";
import authRoute from "./routes/auth";
import { productsRouter } from "./routes/Products.routes";
import { suppliesRouter } from "./routes/supplies.routes";

const app = express();
dotenv.config();

app.use(cors()); // Add this line to use CORS middleware
app.use(express.json());
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productsRouter);
app.use("/api/supplies", suppliesRouter);
app.use("/api/employees", employeesRouter);

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
