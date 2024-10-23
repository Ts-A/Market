import { Router } from "express";

const productRouter = new Router();

import authMiddleware from "../middleware/authMiddleware.js";

export default (controller) => {
  productRouter.get(`/`, controller.getAllProducts);
  productRouter.get(`/:id`, controller.getProduct);
  productRouter.post(`/`, authMiddleware, controller.createProduct);
  productRouter.put(`/:id`, authMiddleware, controller.editProduct);
  productRouter.delete(`/:id`, authMiddleware, controller.deleteProduct);

  return productRouter;
};
