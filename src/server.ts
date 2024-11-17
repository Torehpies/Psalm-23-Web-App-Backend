import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeesRouter } from "./routes/employees.routes"; 
import { ingredientDetailsRouter } from "./routes/ingredientDetails.routes"; 
import { stockHistoryRouter } from "./routes/StockHistory.routes"; 
import { usersRouter } from "./routes/Users.routes"; 
import roleRoute from "./routes/role";
import mongoose from "mongoose";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/api/role", roleRoute);

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
