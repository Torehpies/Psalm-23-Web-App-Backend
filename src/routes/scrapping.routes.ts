import * as express from "express";
import { getAllScrapping, getScrappingById, createScrapping, updateScrapping, deleteScrapping } from "../controllers/scrapping.controller";

const scrappingRouter = express.Router();
scrappingRouter.use(express.json());

scrappingRouter.get("/", getAllScrapping);
scrappingRouter.get("/:id", getScrappingById);
scrappingRouter.post("/create", createScrapping);
scrappingRouter.put("/:id", async (req, res, next) => {
    try {
        await updateScrapping(req, res);
    } catch (error) {
        next(error);
    }
});
scrappingRouter.delete("/:id", async (req, res, next) => {
    try {
        await deleteScrapping(req, res);
    } catch (error) {
        next(error);
    }
});

export default scrappingRouter;
