import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const cartRouter = new Router();

export default (controller) => {
  cartRouter.get(`/`, authMiddleware, controller.showCart);
  cartRouter.post(`/add`, authMiddleware, controller.addToCart);
  cartRouter.post(`/remove`, authMiddleware, controller.removeFromCart);
  cartRouter.post(`/empty`, authMiddleware, controller.emptyCart);
  cartRouter.post(`/checkout`, authMiddleware, controller.checkoutCart);

  return cartRouter;
};
