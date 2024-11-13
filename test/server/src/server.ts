import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";
import { ingredientRouter } from "./ingredients.routes";
import { productRouter } from "./product.routes";
import { productDescriptionRouter } from "./productdescript.routes"; // Import productDescriptionRouter
import { attendanceRouter } from "./attendance.routes"; // Import attendanceRouter

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
    app.use("/ingredients", ingredientRouter);
    app.use("/products", productRouter);
    app.use("/productdescriptions", productDescriptionRouter); // Add productDescriptionRouter
    app.use("/attendance", attendanceRouter); // Add attendanceRouter
    app.listen(7000, () => {
      console.log(`Server running at http://localhost:7000...`);
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
