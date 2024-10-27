import { Router } from "express";

/**
 * Routers
 */
import userRouter from "./UserRouter.js";
import productRouter from "./ProductRouter.js";
import cartRouter from "./CartRouter.js";

/**
 * Microservice clients
 */
import cartClient from "../clients/CartClient.js";
import userClient from "../clients/UserClient.js";
import productClient from "../clients/ProductClient.js";

/**
 * Controllers
 */
import UserController from "../controllers/UserController.js";
import ProductController from "../controllers/ProductController.js";
import CartController from "../controllers/CartController.js";

const userController = UserController(userClient);
const productController = ProductController(productClient);
const cartController = CartController(cartClient);

const apiRouter = Router();

apiRouter.use("/users", userRouter(userController));
apiRouter.use("/products", productRouter(productController));
apiRouter.use("/cart", cartRouter(cartController));

export default apiRouter;
