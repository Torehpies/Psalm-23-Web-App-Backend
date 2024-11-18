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
productsRouter.post("/", createProduct);
productsRouter.put("/:id", updateProduct);
productsRouter.delete("/:id", deleteProduct);
