import * as express from "express";
import {
    getAllProducts,
    getAllCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller";

export const productsRouter = express.Router();
productsRouter.use(express.json());

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories",getAllCategories);
productsRouter.get("/:id", getProductById);
productsRouter.post("/create", createProduct);
productsRouter.put("/update/:id", updateProduct);
productsRouter.delete("/delete/:id", deleteProduct);
