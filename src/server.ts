import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeesRouter } from "./routes/employees.routes"; 
import { ingredientDetailsRouter } from "./routes/ingredientDetails.routes"; 
import { stockHistoryRouter } from "./routes/StockHistory.routes"; 
import { usersRouter } from "./routes/Users.routes"; 

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

    app.use("/employees", employeesRouter); 
    app.use("/ingredientDetails", ingredientDetailsRouter); 
    app.use("/stockHistory", stockHistoryRouter); 
    app.use("/users", usersRouter); // Add this line
    app.listen(7000, () => {
      console.log(`Server running at http://localhost:7000...`);
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
