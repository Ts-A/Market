import { Router } from "express";
import userRouter from "./UserRouter.js";
import UserController from "../controllers/UserController.js";
import productRouter from "./ProductRouter.js";
import ProductController from "../controllers/ProductController.js";
import userClient from "../clients/UserClient.js";
import productClient from "../clients/ProductClient.js";

const userController = UserController(userClient);
const productController = ProductController(productClient);

const apiRouter = Router();

apiRouter.use("/users", userRouter(userController));
apiRouter.use("/products", productRouter(productController));

export default apiRouter;
