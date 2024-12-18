import * as express from "express";
import {
    getAllProducts,
    getAllCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller";
import { verifyToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

export const productsRouter = express.Router();
productsRouter.use(express.json());

productsRouter.get("/", verifyToken, authorizeRoles("admin", "manager", "baker", "cashier"), getAllProducts);
productsRouter.get("/categories",getAllCategories);
productsRouter.get("/:id", getProductById);
productsRouter.post("/create", createProduct);
productsRouter.put("/update/:id", updateProduct);
productsRouter.delete("/delete/:id", deleteProduct);
