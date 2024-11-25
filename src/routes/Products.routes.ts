import * as express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller";

export const productsRouter = express.Router();
productsRouter.use(express.json());

productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.post("/create", createProduct);
productsRouter.put("/update/:id", updateProduct);
productsRouter.delete("/delete/:id", deleteProduct);
