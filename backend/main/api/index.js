import { Router } from "express";
import UserRouter from "./UserRouter.js";
import UserController from "../controllers/UserController.js";

const apiRouter = Router();

const userRouter = UserRouter(apiRouter, UserController);

apiRouter.use("/user", userRouter);

export default apiRouter;
