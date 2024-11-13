import * as express from "express";
import { loginController } from "./login.controller";


export const loginRouter = express.Router();
loginRouter.use(express.json());

loginRouter.post("/", loginController.login);
