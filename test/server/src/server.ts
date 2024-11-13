import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";
import { productRouter } from "./product.routes";
import { productDescriptionRouter } from "./productdescript.routes";
import { attendanceRouter } from "./attendance.routes"; 
import { ingredientDetailsRouter } from "./ingredientDetails.routes"; // Import ingredientDetailsRouter

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/employees", employeeRouter);
    app.use("/products", productRouter);
    app.use("/productdescriptions", productDescriptionRouter);
    app.use("/attendance", attendanceRouter); 
    app.use("/ingredientDetails", ingredientDetailsRouter); // Add ingredientDetailsRouter
    app.listen(7000, () => {
      console.log(`Server running at http://localhost:7000...`);
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
